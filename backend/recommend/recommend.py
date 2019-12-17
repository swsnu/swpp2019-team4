import random
from math import radians, cos, sqrt
from assaapp.models import Course, CourseTime, Building
from recommend.models import CoursePref, TimePref, RecommendTimetable, RecommendCourse

NUM_OF_WEEKDAYS = 6
HOUR_MIN = 8
HOUR_MAX = 21
NUM_OF_TIME_PREFS_PER_DAY = (HOUR_MAX - HOUR_MIN) * 2
NUM_OF_TIME_PREFS = NUM_OF_WEEKDAYS * NUM_OF_TIME_PREFS_PER_DAY
DEFAULT_TIME_PREF = 3.0

ITERATION = 10000
CANDIDATES = 20
MAX_RESULTS = 20
MAX_TABU_SIZE = 100

INFINITY = 100000000


class Buildings:
    def __init__(self):
        buildings = list(Building.objects.all().values('id', 'latitude', 'longitude'))
        self.building_id_to_pos = {building['id']: {'lat': float(building['latitude']),
                                                    'lng': float(building['longitude'])}
                                   for building in buildings}

    def distance(self, building_id_1, building_id_2):
        pos_1 = self.building_id_to_pos[building_id_1]
        pos_2 = self.building_id_to_pos[building_id_2]
        dlat = radians(pos_1['lat'] - pos_2['lat'])
        dlng = radians(pos_1['lng'] - pos_2['lng'])
        dlng *= cos(radians(pos_1['lat']) + dlat / 2)
        return 6378.1 * sqrt(dlat * dlat + dlng * dlng)

class Timeslice:
    def __init__(self, buildings):
        self.timeslice = []
        self.time = []
        self.weekday = [False] * NUM_OF_WEEKDAYS
        self.buildings = buildings

    def append(self, course_time):
        building_id = course_time['building_id']
        start_time = course_time['start_time']
        end_time = course_time['end_time']
        weekday = course_time['weekday']

        # does not consider sunday
        if weekday >= NUM_OF_WEEKDAYS:
            return

        start_index = (min(max(start_time.hour * 60 + start_time.minute, HOUR_MIN * 60),
                           HOUR_MAX * 60 - 1) - HOUR_MIN * 60) // 30
        end_index = (min(max(end_time.hour * 60 + end_time.minute, HOUR_MIN * 60),
                         HOUR_MAX * 60 - 1) - HOUR_MIN * 60) // 30
        self.timeslice += [{'weekday': weekday, 'index': index, 'building_id': building_id}
                           for index in list(range(start_index, end_index + 1))]
        self.time += [weekday * NUM_OF_TIME_PREFS_PER_DAY + index
                      for index in list(range(start_index, end_index + 1))]
        self.weekday[weekday] = True

    def get_weekday(self):
        return self.weekday

    def get_time_list(self):
        return self.time

    def overlap(self, other):
        for time1 in self.timeslice:
            for time2 in other.timeslice:
                if time1['weekday'] is time2['weekday']:
                    diff = abs(time1['index'] - time2['index'])
                    if diff == 0:
                        return True
                    if diff == 1 and self.buildings.distance(
                            time1['building_id'], time2['building_id']) > .5:
                        return True
        return False

    def evaluate(self, timeslice_to_timepref):
        if not self.timeslice:
            return 0
        timepref_sum = 0
        for time in self.timeslice:
            timepref_sum += timeslice_to_timepref[time['weekday']][time['index']]
        return timepref_sum / len(self.timeslice)

class Constraints:
    def __init__(self, user):
        self.credit = (user.credit_min, user.credit_max)
        self.major_credit = (user.major_min, user.major_max)
        self.days_per_week = user.days_per_week

    def penalty(self, credit, major_credit, days_per_week):
        return max([0, self.credit[0] - credit, credit - self.credit[1],
                    self.major_credit[0] - major_credit, major_credit - self.major_credit[1],
                    days_per_week - self.days_per_week])

class TabuSearch:
    def __init__(self, user):
        # handle course preferences
        course_prefs = list(CoursePref.objects.filter(user=user).values('course_id', 'score'))
        self.iid_to_course_id = [course_pref['course_id'] for course_pref in course_prefs]
        self.iid_to_score = [course_pref['score'] for course_pref in course_prefs]
        course_id_to_iid = dict(zip(self.iid_to_course_id, range(len(self.iid_to_course_id))))

        # handle course-time relationship
        courses = list(Course.objects.filter(id__in=self.iid_to_course_id)
                       .values('id', 'course_number', 'credit', 'classification'))
        course_times = list(CourseTime.objects.filter(course__id__in=self.iid_to_course_id)
                            .values('course_id', 'building_id', 'weekday',
                                    'start_time', 'end_time'))

        course_id_to_course_number = {course['id']: course['course_number'] for course in courses}
        course_id_to_credit = {course['id']: course['credit'] for course in courses}
        course_id_to_classification = {course['id']: course['classification'] != '교양'
                                       for course in courses}
        buildings = Buildings()
        self.iid_to_course_number = [course_id_to_course_number[course_id]
                                     for course_id in self.iid_to_course_id]
        self.iid_to_credit = [course_id_to_credit[course_id]
                              for course_id in self.iid_to_course_id]
        self.iid_to_classification = [course_id_to_classification[course_id]
                                      for course_id in self.iid_to_course_id]
        self.iid_to_timeslice = [Timeslice(buildings) for _ in range(len(self.iid_to_course_id))]
        for course_time in course_times:
            iid = course_id_to_iid[course_time['course_id']]
            self.iid_to_timeslice[iid].append(course_time)

        # handle timepref to calculate overall score for each courses
        time_prefs = list(TimePref.objects.filter(user=user)
                          .values('weekday', 'start_time', 'score'))
        timeslice_to_timepref = [[DEFAULT_TIME_PREF] * NUM_OF_TIME_PREFS_PER_DAY
                                 for _ in range(NUM_OF_WEEKDAYS)]
        for time_pref in time_prefs:
            index = (time_pref['start_time'].hour * 60 + time_pref['start_time'].minute
                     - HOUR_MIN * 60) // 30
            timeslice_to_timepref[time_pref['weekday']][index] = time_pref['score']
        for iid in range(len(self.iid_to_course_id)):
            self.iid_to_score[iid] *= self.iid_to_timeslice[iid].evaluate(timeslice_to_timepref)

        # remove similar courses (course_number and timeslice are same... score can be different)
        argsort = sorted(list(range(len(self.iid_to_timeslice))), key=lambda iid:
                         (self.iid_to_course_number[iid],
                          self.iid_to_timeslice[iid].get_time_list(),
                          -self.iid_to_score[iid]))
        iid_save = []
        if argsort:
            iid_save.append(argsort[0])
        for i in range(len(argsort) - 1):
            iid_1 = argsort[i]
            iid_2 = argsort[i + 1]
            if self.iid_to_course_number[iid_1] != self.iid_to_course_number[iid_2] or \
                self.iid_to_timeslice[iid_1].get_time_list() != \
                self.iid_to_timeslice[iid_2].get_time_list():
                # remove courses that the time does not exists
                if self.iid_to_timeslice[iid_2].get_time_list():
                    iid_save.append(iid_2)
        iid_save = sorted(iid_save, key=lambda iid: -self.iid_to_score[iid])

        # remapping
        self.iid_to_course_id = [self.iid_to_course_id[iid] for iid in iid_save]
        self.iid_to_score = [self.iid_to_score[iid] for iid in iid_save]
        self.iid_to_course_number = [self.iid_to_course_number[iid] for iid in iid_save]
        self.iid_to_timeslice = [self.iid_to_timeslice[iid] for iid in iid_save]
        self.iid_to_credit = [self.iid_to_credit[iid] for iid in iid_save]
        self.iid_to_classification = [self.iid_to_classification[iid] for iid in iid_save]

        # precompute 2D overlapping array
        self.iid_length = len(self.iid_to_course_id)
        self.iid_overlap = [[False] * len(self.iid_to_course_id)
                            for _ in range(len(self.iid_to_course_id))]
        for iid_1 in range(self.iid_length):
            timeslice_1 = self.iid_to_timeslice[iid_1]
            for iid_2 in range(self.iid_length):
                self.iid_overlap[iid_1][iid_2] = timeslice_1.overlap(self.iid_to_timeslice[iid_2])

        # handle constraints
        self.constraints = Constraints(user)

        # initialize tabu list
        self.tabu_list = []

        # initialize solution array
        self.results = []
        self.best_candidate_solution = []
        self.best_candidate_fitness = self.evaluate(self.best_candidate_solution)
        self.best_candidate_tabu = []

    def loop(self):
        candidate_solutions = [self.get_neighbor(self.best_candidate_solution)
                               for _ in range(CANDIDATES)]
        self.best_candidate_solution = []
        self.best_candidate_fitness = (-INFINITY, 0)
        self.best_candidate_tabu = []
        for candidate_solution in candidate_solutions:
            candidate_fitness = self.evaluate(candidate_solution)
            if candidate_fitness > self.best_candidate_fitness and \
                not self.find_tabu(candidate_solution):
                self.best_candidate_fitness = candidate_fitness
                self.best_candidate_solution = candidate_solution

        valid = self.best_candidate_fitness[0] == 0
        exist = False
        for result in self.results:
            if result['solution'] == self.best_candidate_solution:
                exist = True
                break

        self.insert_tabu(self.best_candidate_solution)

        if valid and not exist:
            self.results.append({'solution': self.best_candidate_solution,
                                 'fitness': self.best_candidate_fitness})
            for i in reversed(range(len(self.results) - 1)):
                if self.results[i]['fitness'] >= self.results[i+1]['fitness']:
                    break
                self.results[i], self.results[i + 1] = self.results[i + 1], self.results[i]
            if MAX_RESULTS < len(self.results):
                self.results.pop()

    def find_tabu(self, solution):
        return solution in self.tabu_list

    def insert_tabu(self, solution):
        self.tabu_list.append(solution)
        while len(self.tabu_list) > MAX_TABU_SIZE:
            self.tabu_list.pop(0)

    def evaluate(self, solution):
        weekday = [False] * NUM_OF_WEEKDAYS
        days_per_week = 0
        credit = 0
        major_credit = 0
        for iid in solution:
            weekday_time = self.iid_to_timeslice[iid].get_weekday()
            for i in range(NUM_OF_WEEKDAYS):
                weekday[i] = weekday[i] | weekday_time[i]
            credit += self.iid_to_credit[iid]
            if self.iid_to_classification[iid]:
                major_credit += self.iid_to_credit[iid]
        for day in weekday:
            if day is True:
                days_per_week += 1

        # constraint penalty
        penalty = self.constraints.penalty(credit, major_credit, days_per_week)

        # overlap & same course penalty
        for iid_1 in solution:
            for iid_2 in solution:
                if iid_1 is not iid_2:
                    if self.iid_overlap[iid_1][iid_2]:
                        penalty += 1
                    if self.iid_to_course_number[iid_1] == self.iid_to_course_number[iid_2]:
                        penalty += 1

        # preference score
        score = 0
        if solution:
            score_weighted_sum = 0
            weight_sum = 0
            for iid in solution:
                score_weighted_sum += self.iid_to_score[iid] * self.iid_to_credit[iid]
                weight_sum += self.iid_to_credit[iid]
            score = score_weighted_sum / weight_sum

        return (-penalty, score)

    def get_neighbor(self, solution):
        # edge case
        if self.iid_length == 0:
            return []

        increment = False
        if not solution:
            increment = True
        elif len(solution) is self.iid_length:
            increment = False
        else:
            prob = random.random()
            increment = prob > 0.5

        # deep copy
        new_solution = [iid for iid in solution]
        if increment:
            iid = random.randrange(self.iid_length)
            while iid in solution:
                iid = random.randrange(self.iid_length)
            new_solution.append(iid)
        else:
            index = random.randrange(len(solution))
            new_solution.pop(index)
        return sorted(new_solution)

    def get_results(self):
        # print(self.results)
        results_iid = [result['solution'] for result in self.results]
        results_course_id = [[self.iid_to_course_id[iid] for iid in result_iid]
                             for result_iid in results_iid]
        return results_course_id

def run_recommendation(user):
    # get fundamental constants
    tabu = TabuSearch(user)
    for _ in range(ITERATION):
        tabu.loop()
    results = tabu.get_results()

    color_gradient = [
        '#FF0037',
        '#EB1637',
        '#D72C37',
        '#C34237',
        '#AF5837',
        '#9B6E37',
        '#878437',
        '#739A37',
        '#5FB037',
        '#4BC637',
        '#37DC37',
    ]

    converted_results = []
    for result in results:
        recommend_timetable = RecommendTimetable(user=user)
        recommend_timetable.save()
        for course_id in result:
            course = Course.objects.get(id=course_id)
            course_pref = CoursePref.objects.get(user=user, course__id=course_id)
            color = color_gradient[round(course_pref.score)]
            recommend_course = RecommendCourse(timetable=recommend_timetable,
                                               course=course,
                                               color=color)
            recommend_course.save()
        converted_results.append(recommend_timetable)

    if not converted_results:
        empty_timetable = RecommendTimetable(user=user)
        empty_timetable.save()
        converted_results.append(empty_timetable)

    return converted_results

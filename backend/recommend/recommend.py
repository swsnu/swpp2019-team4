from random import sample
from assaapp.models import Course, CourseTime, Building
from recommend.models import CoursePref, TimePref, RecommendTimetable, RecommendCourse
from math import radians, cos, sqrt

# const def begin

WEEKDAYS_LEN = 6
HOURS_LEN = 26
TIME_PREF_LEN = WEEKDAYS_LEN * HOURS_LEN
MAX_TIME_PREF = 3.0
DEFAULT_TIME_PREF = 1.5

MAX_COURSE_ID = 7000
MAX_COURSE_PREF = 10.0
DEFAULT_COURSE_PREF = 5.0

MAX_CANDIDATES = 300
MIN_CREDIT = 15
MAX_CREDIT = 18
MIN_MAJOR = 0
MAX_MAJOR = 18
DAYS_PER_WEEK = 6

# constant def end

def building_distance(self_data, other_data):
    dlat = radians(other_data['lat'] - self_data['lat'])
    dlng = radians(other_data['lng'] - self_data['lng'])
    dlng *= cos(radians(self_data['lat'])+dlat/2)
    return 6378.1*sqrt(dlat*dlat+dlng*dlng)

def get_constants(user):
    global MIN_CREDIT, MAX_CREDIT, MIN_MAJOR, MAX_MAJOR, DAYS_PER_WEEK
    MIN_CREDIT = user.credit_min
    MAX_CREDIT = user.credit_max
    MIN_MAJOR = user.major_min
    MAX_MAJOR = user.major_max
    DAYS_PER_WEEK = user.days_per_week

def get_target_courses(user):
    all_course = list(Course.objects.all().values())
    pref_exist = [False] * MAX_COURSE_ID
    user_course_pref = list(CoursePref.objects.filter(user=user).values())
    for pref in user_course_pref:
        pref_exist[pref['course_id']] = True
    ret = []
    for course in all_course:
        if pref_exist[course['id']]:
            ret.append(course)
    return ret

class TimesliceSet:
    def __init__(self, timeslice_list):
        self._timeslice_list = timeslice_list

    def get_list(self):
        return self._timeslice_list

    def get_time_list (self):
        return [timeslice['index'] for timeslice in self._timeslice_list]

    def overlap(self, otherset):
        i = 0
        otherlist = otherset.get_time_list()
        for ts_data in self.get_time_list():
            while (i < len(otherlist) and otherlist[i] < ts_data):
                i += 1
            if (i == len(otherlist)):
                break
            if (otherlist[i] == ts_data):
                return True
        return False

    def plus(self, otherset):
        new_list = []
        i = 0
        otherlist = otherset.get_list()
        for ts_data in self.get_list():
            while (i < len(otherlist) and otherlist[i]['index'] < ts_data['index']):
                new_list.append(otherlist[i])
                i += 1
            new_list.append(ts_data)
        while i < len(otherlist):
            new_list.append(otherlist[i])
            i += 1
        return TimesliceSet(new_list)

    def valid (self):
        my_list = self.get_list()

        # checks if it satisfies weekday limit
        weekday_exist = [False for i in range(6)]
        for cur in my_list:
            weekday_exist[cur['index']//HOURS_LEN] = True
        weekday_cnt = 0
        for exist in weekday_exist:
            if exist:
                weekday_cnt += 1
        if weekday_cnt > DAYS_PER_WEEK:
            return False

        # checks if it satisfies distance limit in continuous courses
        prv = None
        for cur in my_list:
            if prv and prv['index'] + 1 == cur['index']:
                if building_distance(cur['data'], prv['data']) > 0.5:
                    return False
            prv = cur

        return True

    def equals(self, otherset):
        return self.get_time_list() == otherset.get_time_list()

class ConvertedUserData:
    def __init__(self, user):
        all_course = get_target_courses(user)
        course_len = len(all_course)

        self._index_to_cid = [0] * course_len
        self._cid_to_index = [0] * MAX_COURSE_ID

        for i in range(course_len):
            course_id = all_course[i]['id']
            self._index_to_cid[i] = course_id
            self._cid_to_index[course_id] = i

        self._course_pref_table = [DEFAULT_COURSE_PREF] * len(all_course)
        self._time_pref_table = [DEFAULT_TIME_PREF] * TIME_PREF_LEN

        user_course_pref = list(CoursePref.objects.filter(user=user).values())

        for pref in user_course_pref:
            self._course_pref_table[self._cid_to_index[pref['course_id']]] = pref['score']

        user_time_pref = list(TimePref.objects.filter(user=user).values())
        for pref in user_time_pref:
            start_time = pref['start_time'].hour * 60 + pref['start_time'].minute
            self._time_pref_table[pref['weekday']*HOURS_LEN+(start_time-480)//30] = pref['score']

    def get_course_pref(self, course):
        return self._course_pref_table[self._cid_to_index[course.get_id()]]

    def get_time_pref(self, timeslice_id):
        return self._time_pref_table[timeslice_id]

    def course_score(self, course):
        (c_score, t_score) = course.get_pref(self)
        return c_score * t_score

class ConvertedCourseData:

    def overlap(self, timeslice):
        cur_weekday = timeslice // HOURS_LEN
        cur_start_time = 8 * 60 + timeslice % HOURS_LEN * 30
        for course_time in self._course_time_list:
            if (course_time['start_time'] <= cur_start_time <= course_time['end_time'] and
                    course_time['week_day'] == cur_weekday):
                return {'lat':course_time['building']['lat'],
                        'lng':course_time['building']['lng']} 
        return None

    def get_timeslice_list(self):
        ret_list = []
        for i in range(TIME_PREF_LEN):
            ret = self.overlap(i)
            if ret:
                ret_list.append({'index':i, 'data':ret})
        return ret_list

    def get_timeslice_set(self):
        return self._timeslice_set

    def __init__(self, course):
        self._id = course['id']
        self._credit = course['credit']
        self._major = (course['classification'] != '교양')
        self._course_number = course['course_number']
        self._course_time_list = [course_time.data()
                                  for course_time in CourseTime.objects.filter(course=self._id)]
        self._timeslice_set = TimesliceSet(self.get_timeslice_list())

    def is_major(self):
        return self._major

    def get_id(self):
        return self._id

    def get_credit(self):
        return self._credit

    def get_course_number(self):
        return self._course_number

    def get_pref(self, user):
        c_score = user.get_course_pref(self)
        t_score_list = [user.get_time_pref(tm) for tm in self._timeslice_set.get_time_list()]
        if t_score_list:
            t_score = sum(t_score_list) / len(t_score_list)
        else:
            t_score = 0
        return (c_score, t_score)

def backtrack(terminate_cond,
              append_cond,
              user,
              candidates,
              my_score,
              my_courses,
              my_timeslice_set,
              all_courses,
              index):
    if index == len(all_courses):
        return
    (cur_score, cur_course) = all_courses[index]
    if len(candidates) == MAX_CANDIDATES:
        worst_candidate_score = candidates[-1][0]
        max_possible_score = my_score / len(my_courses) if my_courses else cur_score
        if(max_possible_score <= worst_candidate_score):
            return
    flag = True
    for course in my_courses:
        if course.get_course_number() == cur_course.get_course_number():
            flag = False
            break
    cur_timeslice_set = cur_course.get_timeslice_set()
    if flag and not my_timeslice_set.overlap(cur_timeslice_set):
        new_timeslice_set = my_timeslice_set.plus(cur_timeslice_set)
        if new_timeslice_set.valid():
            my_courses.append(cur_course)
            my_score += cur_score
            if not terminate_cond(my_courses):
                if append_cond(my_courses):
                    candidates.append((my_score/len(my_courses), my_courses.copy()))
                    prv_score = 0
                    cur_score = candidates[-1][0]
                    for i in reversed(range(len(candidates)-1)):
                        prv_score = cur_score
                        cur_score = candidates[i][0]
                        if(prv_score > cur_score):
                            candidates[i], candidates[i+1] = candidates[i+1], candidates[i]
                            cur_score = prv_score
                        else:
                            break
                    if len(candidates) > MAX_CANDIDATES:
                        candidates.pop()
                backtrack(terminate_cond,
                        append_cond,
                        user,
                        candidates,
                        my_score,
                        my_courses,
                        new_timeslice_set,
                        all_courses,
                        index + 1)
            my_courses.pop()
            my_score -= cur_score
    backtrack(terminate_cond,
              append_cond,
              user,
              candidates,
              my_score,
              my_courses,
              my_timeslice_set,
              all_courses,
              index + 1)

def run_recommendation(user):
    get_constants(user)

    user_data = ConvertedUserData(user)

    all_course_data = list(map(ConvertedCourseData, get_target_courses(user)))
    all_course_data.sort(key=
                         lambda x: (x.get_timeslice_set().get_time_list(), user_data.course_score(x)),
                         reverse=True)

    unique_course_data = []
    valid_course_data = []

    for course_data in all_course_data:
        if not course_data.get_timeslice_set().get_list():
            continue
        valid_course_data.append((user_data.course_score(course_data), course_data))
        if unique_course_data:
            back = unique_course_data[-1][1]
            if back.get_timeslice_set().equals(course_data.get_timeslice_set()):
                continue
        unique_course_data.append((user_data.course_score(course_data), course_data))

    unique_course_data.sort(key=lambda x: x[0], reverse=True)
    valid_course_data.sort(key=lambda x: x[0], reverse=True)

    def termi1(course_list):
        my_credit = 0
        for course in course_list:
            my_credit += course.get_credit()
        return my_credit > MAX_CREDIT

    def appnd1(course_list):
        my_credit = 0
        for course in course_list:
            my_credit += course.get_credit()
        return my_credit >= MIN_CREDIT and course_list

    candidates = []
    backtrack(termi1,
              appnd1,
              user_data,
              candidates,
              0,
              [],
              TimesliceSet([]),
              unique_course_data,
              0)

    answer = []
    for candidate_pair in candidates:
        (_, candidate) = candidate_pair

        using_courses = []

        for course1 in valid_course_data:
            flag = False
            for course2 in candidate:
                if course1[1].get_timeslice_set().equals(course2.get_timeslice_set()):
                    flag = True
                    break
            if flag:
                using_courses.append(course1)

        def termi2(course_list):
            my_credit = 0
            my_major = 0
            for course in course_list:
                cur_credit = course.get_credit()
                my_credit += cur_credit
                my_major += cur_credit if course.is_major() else 0
            return my_credit > MAX_CREDIT or my_major > MAX_MAJOR

        def appnd2(course_list):
            my_credit = 0
            my_major = 0
            for course in course_list:
                cur_credit = course.get_credit()
                my_credit += cur_credit
                my_major += cur_credit if course.is_major() else 0
            return my_credit >= MIN_CREDIT and my_major >= MIN_MAJOR and course_list

        backtrack(termi2,
                  appnd2,
                  user,
                  answer,
                  0,
                  [],
                  TimesliceSet([]),
                  using_courses,
                  0)

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

    course_map = [None] * MAX_COURSE_ID
    for course in Course.objects.all():
        course_map[course.data()['id']] = course

    answer = sample(answer[:min(100, len(answer))], min(20, len(answer)))

    converted_answer = []
    for timetable in answer:
        recommend_timetable = RecommendTimetable(user=user)
        recommend_timetable.save()
        for _, converted_course in enumerate(timetable[1]):
            course_pref = user_data.get_course_pref(converted_course)
            color = color_gradient[round(course_pref)]
            recommend_course = RecommendCourse(timetable=recommend_timetable,
                                               course=course_map[converted_course.get_id()],
                                               color=color)
            recommend_course.save()
        converted_answer.append(recommend_timetable)

    if not converted_answer:
        empty_timetable = RecommendTimetable(user=user)
        empty_timetable.save()
        converted_answer.append(empty_timetable)

    return converted_answer

from assaapp.models import User, Course, CourseTime
from recommend.models import CoursePref, TimePref
from functools import cmp_to_key
from random import sample

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

# constant def end

def get_constants (user):
    global MIN_CREDIT, MAX_CREDIT, MIN_MAJOR, MAX_MAJOR
    MIN_CREDIT = user.credit_min
    MAX_CREDIT = user.credit_max
    MIN_MAJOR = user.major_min
    MAX_MAJOR = user.major_max

def get_target_courses (user):
    all_course = [ course for course in Course.objects.all().values() ]
    pref_exist = [ False ] * MAX_COURSE_ID
    user_course_pref = [ pref for pref in CoursePref.objects.filter(user=user).values() ]
    for pref in user_course_pref:
        pref_exist[pref['course_id']] = True
    ret = []
    for course in all_course:
        if pref_exist[course['id']]:
            ret.append(course)
    return ret

class TimesliceSet:
    def __init__ (self, timeslice_list):
        self._timeslice_list = timeslice_list

    def get_list (self):
        return self._timeslice_list

    def overlap (self, otherset):
        i = 0
        otherlist = otherset.get_list()
        for ts in self._timeslice_list:
            while (i < len(otherlist) and otherlist[i] < ts):
                i += 1
            if (i == len(otherlist)):
                break
            if (otherlist[i] == ts):
                return True
        return False
    
    def plus (self, otherset):
        new_list = []
        i = 0
        for ts in self._timeslice_list:
            while (i < len(otherset) and otherset[i] < ts):
                new_list.append(otherset[i])
                i += 1
            new_list.append(ts)
        while i < len(otherset):
            new_list.append(otherset[i])
            i += 1
        return TimesliceSet(new_list)

    def equals (self, otherset):
        return self.get_list() == otherset.get_list()

class ConvertedUserData:
    def __init__ (self, user):
        all_course = get_target_courses(user)

        self._index_to_cid = [ 0 ] * len(all_course)
        self._cid_to_index = [ 0 ] * MAX_COURSE_ID

        for i in range(len(all_course)):
            course_id = all_course[i]['id']
            self._index_to_cid[i] = course_id
            self._cid_to_index[course_id] = i

        self._course_pref_table = [ DEFAULT_COURSE_PREF ] * len(all_course)
        self._time_pref_table = [ DEFAULT_TIME_PREF ] * TIME_PREF_LEN

        user_course_pref = [ pref for pref in CoursePref.objects.filter(user=user).values() ]

        for pref in user_course_pref:
            self._course_pref_table[self._cid_to_index[pref['course_id']]] = pref['score']

        user_time_pref = [ pref for pref in TimePref.objects.filter(user=user).values() ]
        for pref in user_time_pref:
            start_time = pref['start_time'].hour * 60 + pref['start_time'].minute
            self._time_pref_table[pref['weekday']*HOURS_LEN+(start_time-480)//30] = pref['score']

    def get_course_pref (self, course):
        return self._course_pref_table[self._cid_to_index[course.get_id()]]

    def get_time_pref (self, timeslice_id):
        return self._time_pref_table[timeslice_id]

    def course_score (self, course):
        (c_score, t_score) = course.get_pref(self)
        return c_score * t_score

class ConvertedCourseData:

    def overlap (self, timeslice):
        cur_weekday = timeslice // HOURS_LEN
        cur_start_time = 8 * 60 + timeslice % HOURS_LEN * 30
        for course_time in self._course_time_list: 
            if (course_time['start_time'] <= cur_start_time and 
                cur_start_time <= course_time['end_time'] and 
                course_time['week_day'] == cur_weekday) :
                return True
        return False

    def get_timeslice_list (self):
        ret_list = []
        for i in range(TIME_PREF_LEN):
            if self.overlap(i):
                ret_list.append(i)
        return ret_list

    def get_timeslice_set (self):
        return self._timeslice_set

    def __init__ (self, course):
        self._id = course['id']
        self._credit = course['credit']
        self._major = (course['classification'] != '교양')
        self._course_number = course['course_number']
        self._course_time_list = [ course_time.data() for course_time in CourseTime.objects.filter(course=self._id) ]
        self._timeslice_set = TimesliceSet(self.get_timeslice_list())

    def is_major (self):
        return self._major

    def get_id (self):
        return self._id
    
    def get_credit (self):
        return self._credit
    
    def get_course_number (self):
        return self._course_number

    def get_pref (self, user) :
        c_score = user.get_course_pref(self)
        t_score_list = [ user.get_time_pref(tm) for tm in self._timeslice_set.get_list() ]
        if t_score_list:
            t_score = sum(t_score_list) / len(t_score_list) 
        else:
            t_score = 0
        return (c_score, t_score)

def backtrack (terminate_cond, append_cond, user, candidates, my_score, my_courses, all_courses, index):
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
        if (course.get_course_number() == cur_course.get_course_number() or
            course.get_timeslice_set().overlap(cur_course.get_timeslice_set())):
            flag = False
            break
    if flag:
        my_courses.append(cur_course)
        my_score += cur_score
        if not terminate_cond (my_courses):
            if append_cond (my_courses):
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
            backtrack(terminate_cond, append_cond, user, candidates, my_score, my_courses, all_courses, index+1)
        my_courses.pop()
        my_score -= cur_score
    backtrack(terminate_cond, append_cond, user, candidates, my_score, my_courses, all_courses, index+1)

def run_recommendation (user):
    get_constants(user)

    user_data = ConvertedUserData(user)
   
    all_course_data = list(map(lambda x : ConvertedCourseData(x), get_target_courses(user)))
    all_course_data.sort(key = lambda x : (x.get_timeslice_set().get_list(), user_data.course_score(x)), reverse = True)

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
    
    unique_course_data.sort(key = lambda x : x[0], reverse = True)
    valid_course_data.sort(key = lambda x : x[0], reverse = True)

    def termi1 (x):
        my_credit = 0
        for course in x:
            my_credit += course.get_credit()
        return my_credit > MAX_CREDIT

    def appnd1 (x):
        my_credit = 0
        for course in x:
            my_credit += course.get_credit()
        return my_credit >= MIN_CREDIT and x

    candidates = []
    backtrack(termi1, appnd1, user_data, candidates, 0, [], unique_course_data, 0)

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

        def termi2 (x):
            my_credit = 0
            my_major = 0
            for course in x:
                cur_credit = course.get_credit()
                my_credit += cur_credit
                my_major += cur_credit if course.is_major() else 0
            return my_credit > MAX_CREDIT or my_major > MAX_MAJOR

        def appnd2 (x):
            my_credit = 0
            my_major = 0
            for course in x:
                cur_credit = course.get_credit()
                my_credit += cur_credit
                my_major += cur_credit if course.is_major() else 0
            return my_credit >= MIN_CREDIT and my_major >= MIN_MAJOR and x
        
        backtrack(termi2, appnd2, user, answer, 0, [], using_courses, 0)
    
    color_gradient = [
      '#FC466B',
      '#E94879',
      '#D64A87',
      '#C34D96',
      '#B04FA4',
      '#9D52B3',
      '#8A54C1',
      '#7756CF',
      '#6459DE',
      '#515BEC',
      '#3F5EFB',
    ]

    course_map = [ None ] * MAX_COURSE_ID
    for course in Course.objects.all():
        course_map[course.data()['id']] = course

    answer = sample(answer[:min(100, len(answer))], min(20, len(answer)))

    formatted_answer = []
    for timetable in answer:
        formatted_courses = []
        for converted_course in timetable[1]:
            course = course_map[converted_course.get_id()]
            course_pref = user_data.get_course_pref(converted_course)
            color_dict = {'color': color_gradient[round(course_pref)]}
            course_data = course.data()
            course_data.update(color_dict)
            formatted_courses.append(course_data)
        formatted_answer.append({'course': formatted_courses})

    return formatted_answer
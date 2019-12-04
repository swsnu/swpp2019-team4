from assaapp.models import User, Course, CourseTime
from recommend.models import CoursePref, TimePref
from functools import cmp_to_key

# const def begin

TIME_PREF_LEN = 32 * 6
MAX_TIME_PREF = 3.0
DEFAULT_TIME_PREF = 1.5

MAX_COURSE_ID = 4200
MAX_COURSE_PREF = 10.0
DEFAULT_COURSE_PREF = 5.0

MAX_CANDIDATES = 100
MIN_CREDITS = 15
MAX_CREDITS = 18

# constant def end

def get_target_courses (user):
    all_course = [ course for course in Course.objects.all().values() ]
    pref_exist = [ False ] * MAX_COURSE_ID
    user_course_pref = [ pref for pref in CoursePref.objects.filter(user=user).values() ]
    for pref in user_course_pref:
        pref_exist[pref['course']] = True
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
        for ts in self._timeslice_list:
            while (i < len(otherset) and otherset[i] < ts):
                i += 1
            if (i == len(otherset)):
                break
            if (otherset[i] == ts):
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
            self._course_pref_table[self._cid_to_index[pref['course']]] = pref['preference']

    def get_course_pref (self, course):
        return self._course_pref_table[self._cid_to_index[course.get_id()]]

    def get_time_pref (self, timeslice_id):
        return self._time_pref_table[timeslice_id]

    def course_score (self, course):
        (c_score, t_score) = course.get_pref(self)
        return c_score * t_score

    def timetable_score (self, course_list):
        c_sum = 0
        t_sum = 0
        for course in course_list:
            (c_score, t_score) = course.get_pref(self)
            c_sum += c_score
            t_sum += t_score
        return c_sum * t_sum

class ConvertedCourseData:

    def overlap (self, timeslice):
        cur_weekday = timeslice // 32
        cur_start_time = 8 * 60 + timeslice % 32 * 30
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
        self._course_time_list = [ course_time.data() for course_time in CourseTime.objects.filter(course=self._id) ]
        self._timeslice_set = TimesliceSet(self.get_timeslice_list())
    
    def get_id (self):
        return self._id
    
    def get_credit (self):
        return self._credit

    def get_pref (self, user) :
        c_score = user.get_course_pref(self)
        t_score_list = [ user.get_time_pref(tm) for tm in self._timeslice_set.get_list() ]
        if t_score_list:
            t_score = sum(t_score_list) / len(t_score_list) 
        else:
            t_score = 0
        return (c_score, t_score)

def backtrack (user, candidates, my_credit, my_score, my_courses, all_courses, index):
    if my_credit > MAX_CREDITS:
        return
    if my_credit >= MIN_CREDITS:
        candidates.append((my_score, my_courses))
        prv_score = 0
        cur_score = my_score
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
    if index == len(all_courses):
        return
    (cur_score, cur_course) = all_courses[index]
    cur_credit = cur_course.get_credit()
    if len(candidates) == MAX_CANDIDATES:
        worst_candidate_score = candidates[-1][0]
        max_possible_score = my_score + cur_score * (MAX_CREDITS - my_credit) / cur_credit
        if(max_possible_score <= worst_candidate_score):
            return
    my_courses.append(cur_course)
    backtrack(user, candidates, my_credit + cur_credit, my_score + cur_score, my_courses, all_courses, index+1)
    my_courses.pop()
    backtrack(user, candidates, my_credit, my_score, my_courses, all_courses, index+1)

def run_recommendation (user):
    user_data = ConvertedUserData(user)
   
    all_course_data = map(lambda x : ConvertedCourseData(x), get_target_courses(user))
    all_course_data.sort(key = lambda x : (x.get_timeslice_set().get_list(), user_data.course_score(x)), reverse = True)

    unique_course_data = []
    for course_data in all_course_data:
        if not course_data.get_timeslice_set().get_list():
            continue
        if unique_course_data:
            back = unique_course_data[-1][1]
            if back.get_timeslice_set().equals(course_data.get_timeslice_set()):
                continue
        unique_course_data.append((user_data.course_score(course_data), course_data))
    
    candidates = []
    backtrack(user_data, candidates, 0, 0, [], unique_course_data, 0)
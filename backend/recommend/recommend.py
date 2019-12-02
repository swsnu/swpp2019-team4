from assaapp.models import User, Course
from recommend.models import CoursePref, TimePref

class ConvertedUserData:
    TIME_PREF_LEN = 32 * 6
    MAX_TIME_PREF = 3.0
    DEFAULT_TIME_PREF = 1.5

    MAX_COURSE_ID = 4200
    MAX_COURSE_PREF = 10.0
    DEFAULT_COURSE_PREF = 5.0

    def __init__ (self, user):
        cud = ConvertedUserData
        all_course = [ course for course in Course.objects.all().values() ]

        self._index_to_cid = [ 0 ] * len(all_course)
        self._cid_to_index = [ 0 ] * MAX_COURSE_ID

        for i in range(len(all_course)):
            course_id = all_course[i]['id']
            self._index_to_cid[i] = course_id
            self._cid_to_index[course_id] = i

        self._course_pref_table = [ cud.DEFAULT_COURSE_PREF ] * len(all_course)
        self._time_pref_table = [ cud.DEFAULT_TIME_PREF ] * cud.TIME_PREF_LEN

        user_course_pref = [ pref for pref in CoursePref.objects.filter(user=user).values() ]

        for pref in user_course_pref:
            self._course_pref_table[self._cid_to_index[pref['course_id']]] = pref['preference']

    def get_course_pref (self, course_id):
        return self._course_pref_table[self._cid_to_index[course_id]]

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

class TimesliceSet:
    INFINITY = 10000

    def __init__ (self, timeslice_list):
        self._timeslice_list = timeslice_list

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

class ConvertedCourseData:
    TIME_PREF_LEN = 32 * 6

    def overlap (self, timeslice):
        return False

    def get_timeslice_list (self):
        ret_list = []
        for i in range(ConvertedCourseData.TIME_PREF_LEN):
            if not self.overlap(i):
                ret_list.append(i)
        return ret_list

    def __init__ (self, course):
        self._id = course['id']
        self._timeslice_set = TimesliceSet(self.get_timeslice_list())

def recommend (user):
    pass 
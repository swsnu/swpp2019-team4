import json
from django.test import TestCase, Client
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.forms.models import model_to_dict
from assaapp.models import User, Timetable, Course, CustomCourse, CourseTime, Building
from assaapp.tokens import ACCOUNT_ACTIVATION_TOKEN
class AssaTestCase(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.user_set = []
        self.user_set.append(User.objects.create_superuser(
            email='cubec@gmail.com', password='cubec', username='Jung Jaeyun'))
        self.user_set.append(User.objects.create_user(
            email='khsoo@gmail.com', password='khsoo', username='Kim Hyunsoo'))
        self.user_set.append(User.objects.create_superuser(
            email='young@naver.com', password='young', username='Kim Youngchan'))
        self.user_set.append(User.objects.create_user(
            email='koo@never.com', password='koo', username='Koo Junseo'))
        self.user_set.append(User.objects.create_user(
            email='assa.staff@gmail.com', password='assaapp', username='SWPP'))

        # friend relationship
        self.user_set[0].friends.add(self.user_set[1])
        self.user_set[2].friends_request.add(self.user_set[0])
        self.user_set[0].friends_request.add(self.user_set[3])

        Timetable.objects.create(title='21', user=self.user_set[0])
        Timetable.objects.create(title='22', user=self.user_set[0])
        Course.objects.create(
            semester="2019-2",
            classification="전필",
            college="공과대학",
            department="컴퓨터공학부",
            degree_program="학사",
            academic_year='3학년',
            course_number="M1522.002400",
            lecture_number="001",
            title="swpp",
            subtitle="",
            credit=4,
            lecture_credit=2,
            lab_credit=1,
            lecture_type="",
            location="301동",
            professor="전병곤",
            quota="80",
            remark="소개원실 재미있어요",
            language="영어",
            status="설강"
        )

    def make_course(self, req_data, course):
        str_detail = [
            'semester',
            'classification',
            'college',
            'department',
            'degree_program',
            'academic_year',
            'course_number',
            'lecture_number',
            'title',
            'subtitle',
            'credit',
            'lecture_credit',
            'lab_credit',
            'lecture_type',
            'time',
            'location',
            'professor',
            'quota',
            'remark',
            'language',
            'status'
        ]
        req_detail = {}
        for detail in str_detail:
            req_detail[detail] = req_data[detail]

        if course is None:
            course = Course(**req_detail)
            return course

        Course.objects.filter(id=course.id).update(**req_detail)
        return Course.objects.get(id=course.id)

    def get(self, *args, **kwargs):
        return self.client.get(*args, **kwargs)

    def post(self, *args, **kwargs):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
        return self.client.post(*args, **kwargs, HTTP_X_CSRFTOKEN=csrftoken)

    def post_nocsrf(self, *args, **kwargs):
        return self.client.post(*args, **kwargs)

    def delete(self, *args, **kwargs):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
        return self.client.delete(*args, **kwargs, HTTP_X_CSRFTOKEN=csrftoken)

    def put(self, *args, **kwargs):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
        return self.client.put(*args, **kwargs, HTTP_X_CSRFTOKEN=csrftoken)

    def test_csrf(self):
        response = self.post('/api/token/')
        self.assertEqual(response.status_code, 405)
        response = self.post_nocsrf('/api/signin/',
                                    json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_superuser(self):
        user = User.objects.get(id=1)
        self.assertEqual(str(user), 'cubec@gmail.com')
        self.assertEqual(user.is_staff, True)
        self.assertEqual(user.has_perm('a'), True)
        self.assertEqual(user.has_module_perms('b'), True)

    def test_user(self):
        try:
            User.objects.create_user(email=None, password='1234', username='1234')
        except ValueError:
            pass
        else:
            self.fail('Did not see ValueError')

    def test_post_signup(self):
        content = {'email': 'paden@gmail.com', 'password': 'paden', 'username': 'KYC', 'grade': '3'}
        response = self.post('/api/signup/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/signup/', json.dumps(content), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.get(email='paden@gmail.com').grade, 3)
        # test for same email
        response = self.post('/api/signup/', json.dumps(content), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_signup(self):
        response = self.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

    def test_post_signin(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'Password': 'cubec2'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec2'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_put_signout(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.put('/api/signout/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_get_signout(self):
        response = self.get('/api/signout/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/signout/')
        self.assertEqual(response.status_code, 204)

    def test_get_signin(self):
        response = self.get('/api/signin/')
        self.assertEqual(response.status_code, 405)

    def test_delete_user(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.delete('/api/user/')
        self.assertEqual(response.status_code, 405)

    def test_get_user(self):
        response = self.get('/api/user/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('cubec', response.content.decode())
        self.assertIn('grade', response.content.decode())

    def test_put_user(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.put('/api/user/',
                            json.dumps({'password_prev': 'cube2', 'password': 'cube3'}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 403)
        response = self.put('/api/user/',
                            json.dumps({'password_prev': 'cubec', 'password': 'cube3'}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.put('/api/user/',
                            json.dumps({'password_prev': 'cube3', 'grade': 6}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/user/',
                            json.dumps({'grade': 6}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_get_user_friend(self):
        response = self.get('/api/user/friend/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/user/friend/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data['friend']), 1)

    def test_delete_user_friend(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.delete('/api/user/friend/')
        self.assertEqual(response.status_code, 405)

    def test_put_user_friend_id(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.put('/api/user/friend/1/')
        self.assertEqual(response.status_code, 405)

    def test_post_user_friend_id(self):
        response = self.post('/api/user/friend/9/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/user/friend/9/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.user_set[0].friends_request.filter(id=2).count(), 0)
        self.assertEqual(self.user_set[0].friends.filter(id=2).count(), 1)
        response = self.post('/api/user/friend/4/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user_set[0].friends.filter(id=4).count(), 1)
        self.assertEqual(self.user_set[0].friends_request.filter(id=4).count(), 0)

    def test_delete_user_friend_id(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.delete('/api/user/friend/9/')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/user/friend/2/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.user_set[0].friends_request.filter(id=2).count(), 0)
        self.assertEqual(self.user_set[0].friends.filter(id=2).count(), 0)
        response = self.delete('/api/user/friend/3/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.user_set[2].friends.filter(id=1).count(), 0)
        self.assertEqual(self.user_set[2].friends_request.filter(id=1).count(), 0)
        response = self.delete('/api/user/friend/4/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.user_set[0].friends.filter(id=4).count(), 0)
        self.assertEqual(self.user_set[0].friends_request.filter(id=4).count(), 0)

    def test_delete_user_search(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.delete('/api/user/friend/search/')
        self.assertEqual(response.status_code, 405)

    def test_post_user_search(self):
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'cubec@gmail.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'cubec@gmail.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'khsoo@gmail.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'young@naver.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'koo@never.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())['user']['username'], 'Koo Junseo')
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'assa.staff@gmail.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())['user']['username'], 'SWPP')
        response = self.post('/api/user/friend/search/',
                             json.dumps({'email': 'khsoo2@gmail.com'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_timetable(self):
        timetable = Timetable.objects.get(id=2)
        self.assertEqual(str(timetable), 'My timetable')

    def test_post_timetable_main_id(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/timetable/main/2')
        self.assertEqual(response.status_code, 405)
        response = self.post('/api/timetable/main/200')
        self.assertEqual(response.status_code, 404)
        response = self.post('/api/timetable/main/1')
        self.assertEqual(response.status_code, 201)

    def test_timetable_main_id_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/timetable/main/3')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/timetable/main/3')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/main/3')
        self.assertEqual(response.status_code, 405)

    def test_timetable_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.put('/api/timetable/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/')
        self.assertEqual(response.status_code, 405)

    def test_get_timetable(self):
        response = self.get('/api/timetable/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        Building(name='SNU', latitude=0, longitude=0).save()
        CourseTime(course=Course.objects.get(id=1),
                   weekday=0, start_time="17:00", end_time="18:30",
                   building=Building.objects.get(id=1), lectureroom="0").save()
        CourseTime(course=Course.objects.get(id=1),
                   weekday=2, start_time="17:00", end_time="18:30",
                   building=Building.objects.get(id=1), lectureroom="0").save()
        CourseTime(course=Course.objects.get(id=1),
                   weekday=3, start_time="18:30", end_time="20:30",
                   building=Building.objects.get(id=1), lectureroom="0").save()
        CustomCourse(timetable=Timetable.objects.get(id=1),
                     course=Course.objects.get(id=1), color="#2468AC").save()
        response = self.get('/api/timetable/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(3, len(json.loads(response.content.decode())))

    def test_post_timetable(self):
        response = self.post('/api/timetable/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/timetable/', json.dumps({}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/timetable/',
                             json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.get('/api/timetable/')
        self.assertEqual(4, len(json.loads(response.content.decode())))

    def test_timetable_id_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/timetable/1/')
        self.assertEqual(response.status_code, 405)

    def test_get_timetable_id(self):
        response = self.get('/api/timetable/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        Building(name='SNU', latitude=0, longitude=0).save()
        CourseTime(course=Course.objects.get(id=1),
                   weekday=0, start_time="17:00", end_time="18:30",
                   building=Building.objects.get(id=1), lectureroom="0").save()
        CourseTime(course=Course.objects.get(id=1),
                   weekday=2, start_time="17:00", end_time="18:30",
                   building=Building.objects.get(id=1), lectureroom="0").save()
        CourseTime(course=Course.objects.get(id=1),
                   weekday=3, start_time="18:30", end_time="20:30",
                   building=Building.objects.get(id=1), lectureroom="0").save()
        CustomCourse(timetable=Timetable.objects.get(id=1),
                     course=Course.objects.get(id=1), color="#2468AC").save()
        response = self.get('/api/timetable/1/')
        self.assertEqual(response.status_code, 200)
        #self.assertEqual(response.content.decode(),
        #                 '[{"course_id": 1, "custom_course_id": 1, "timetable_id": 1,'
        #                 ' "title": "swpp", "week_day": 0, "start_time": 1020,'
        #                 ' "end_time": 1110, "color": "#2468AC",'
        #                 ' "lecture_number": "001",'
        #                 ' "course_number": "M1522.002400"},'
        #                 ' {"course_id": 1, "custom_course_id": 1, "timetable_id": 1,'
        #                 ' "title": "swpp", "week_day": 2, "start_time": 1020,'
        #                 ' "end_time": 1110, "color": "#2468AC",'
        #                 ' "lecture_number": "001",'
        #                 ' "course_number": "M1522.002400"},'
        #                 ' {"course_id": 1, "custom_course_id": 1, "timetable_id": 1,'
        #                 ' "title": "swpp", "week_day": 3, "start_time": 1110,'
        #                 ' "end_time": 1230, "color": "#2468AC",'
        #                 ' "lecture_number": "001",'
        #                 ' "course_number": "M1522.002400"}]')

        response = self.get('/api/timetable/101/')
        self.assertEqual(response.status_code, 404)

    def test_put_timetable_id(self):
        response = self.put('/api/timetable/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.put('/api/timetable/1/', json.dumps({}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/timetable/101/',
                            json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.put('/api/timetable/1/',
                            json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_put_timetable_id_diff_user(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'young@naver.com', 'password': 'young'}),
                             content_type='application/json')
        response = self.put('/api/timetable/1/',
                            json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_delete_timetable_id(self):
        response = self.delete('/api/timetable/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.delete('/api/timetable/1/')
        self.assertEqual(response.status_code, 400)
        response = self.delete('/api/timetable/101/')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/timetable/6/')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/timetable/')
        self.assertEqual(2, len(json.loads(response.content.decode())))

    def test_delete_timetable_id_diff_user(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'young@naver.com', 'password': 'young'}),
                             content_type='application/json')
        response = self.delete('/api/timetable/1/')
        self.assertEqual(response.status_code, 403)

    def test_timetable_id_course_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.put('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 405)
        response = self.get('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 405)

    def test_post_timetable_id_course(self):
        response = self.post('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/timetable/1/course/', json.dumps({}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/timetable/1/course/', json.dumps({'course_id':101}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.post('/api/timetable/101/course/', json.dumps({'course_id':1}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.post('/api/timetable/1/course/', json.dumps({'course_id': 1}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/timetable/')
        self.assertEqual(1, len(json.loads(response.content.decode())[0]['course']))

    def test_post_timetable_id_custom_course(self):
        response = self.post('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/timetable/1/customCourse/', json.dumps({}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 400)
        Building(id=0, name='SNU', latitude=0, longitude=0).save()
        response = self.post('/api/timetable/200/customCourse/',
                             json.dumps({'title':'swpp',
                                         'color':'#FFFFFF',
                                         'time':[{'week_day': 0,
                                                  'start_time': '18:00',
                                                  'end_time': '21:00',
                                                  'building': {'name':'SNU','detail':''},
                                                  'detail': ''}]}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.post('/api/timetable/1/customCourse/',
                             json.dumps({'title':'swpp',
                                         'color':'#FFFFFF',
                                         'time':[{'week_day': 0,
                                                  'start_time': '18:00',
                                                  'end_time': '21:00',
                                                  'building': {'name':'SNU','detail':''}}]}),
                             content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/timetable/')
        self.assertEqual(1, len(json.loads(response.content.decode())[0]['course']))

    def test_timetable_id_custom_course_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 405)

    def test_delete_timetable_id_custom_course_id(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        Building(id=0, name='SNU', latitude=0, longitude=0).save()
        response = self.post('/api/timetable/1/customCourse/',
                             json.dumps({'title':'swpp',
                                         'color':'#FFFFFF',
                                         'time':[{'week_day': 0,
                                                  'start_time': '18:00',
                                                  'end_time': '21:00'}]}),
                             content_type='application/json')
        response = self.delete('/api/timetable/1/customCourse/2')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/timetable/100/customCourse/1')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/timetable/1/customCourse/1')
        response = self.get('/api/timetable/')
        self.assertEqual(0, len(json.loads(response.content.decode())[0]['course']))

    def test_timetable_id_custom_course_id_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/1/customCourse/')
        self.assertEqual(response.status_code, 405)

    def test_course_not_allowed(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.post('/api/course/')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/course/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/course/')
        self.assertEqual(response.status_code, 405)

    def test_get_course(self):
        response = self.get('/api/course/?start=0&end=49&title=asdf&classification=&department=&degree_program=&academic_year=&course_number=&lecture_number=&professor=&language=&min_credit=&max_credit=&min_score=&max_score=')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
                             content_type='application/json')
        response = self.get('/api/course/?start=0&end=49&title=asdf&classification=&department=&degree_program=&academic_year=&course_number=&lecture_number=&professor=&language=&min_credit=&max_credit=&min_score=&max_score=')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(0, len(json.loads(response.content.decode())))
        response = self.get('/api/course/?start=0&end=49&title=swpp&classification=&department=&degree_program=&academic_year=&course_number=&lecture_number=&professor=&language=&min_credit=&max_credit=&min_score=&max_score=')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(1, len(json.loads(response.content.decode())))
        response = self.get('/api/course/?start=1&end=49&title=swpp&classification=&department=&degree_program=&academic_year=&course_number=&lecture_number=&professor=&language=&min_credit=&max_credit=&min_score=&max_score=')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(0, len(json.loads(response.content.decode())))

    def test_make_course(self):
        req_data = {
            "id":2, "semester":"2019-2", "classification":"전필", "college":"공과대학",
            "department":"컴퓨터공학부", "degree_program":"학사", "academic_year":'3학년',
            "course_number":"M1522.002400", "lecture_number":"001",
            "title":"swpp", "subtitle":"", "credit":4, "lecture_credit":2,
            "lab_credit":1, "lecture_type":"", 'time': '월(5:00~6:15)', "location":"301동", "professor":"전병곤",
            "quota":"80", "remark":"소개원실 재미있어요", "language":"영어", "status":"설강"
        }
        course = self.make_course(req_data, None)
        course.save()
        self.assertEqual(model_to_dict(course), req_data)
        course = self.make_course(req_data, course)
        self.assertEqual(model_to_dict(course), req_data)

    def test_get_verify(self):
        user = User.objects.create_user(email='1207koo@gmail.com', password='koo', username='KOO')
        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        token = ACCOUNT_ACTIVATION_TOKEN.make_token(user)
        response = self.get('/api/verify/{}/0000000-0000000/'.format(uidb64))
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/verify/0/{}/'.format(token))
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/verify/{}/{}/'.format(uidb64, token))
        self.assertEqual(response.status_code, 204)

    def test_delete_verify(self):
        User.objects.create_user(email='1207koo@gmail.com', password='koo', username='KOO')
        response = self.delete('/api/verify/0/0000000-0000000/')
        self.assertEqual(response.status_code, 405)

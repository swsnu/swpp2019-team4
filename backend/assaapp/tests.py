from django.test import TestCase, Client
from assaapp.models import User, Timetable, Course
from assaapp.tokens import account_activation_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.db.models import ProtectedError
import json
import logging
    
class AssaTestCase(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        user1 = User.objects.create_superuser(email='cubec@gmail.com', password='cubec', username='Jung Jaeyun')
        user2 = User.objects.create_user(email='khsoo@gmail.com', password='khsoo', username='Kim Hyunsoo')
        user3 = User.objects.create_superuser(email='young', password='young', username='Kim Youngchan')
        timetable1 = Timetable.objects.create(title='21', user=user1)
        timetable2 = Timetable.objects.create(title='22', user=user1)
        course1 = Course.objects.create(
            semester="2019-2",
            classification="전필",
            college="공과대학",
            department="컴퓨터공학부",
            degree_program="학사",
            academic_year=3,
            course_number="M1522.002400",
            lecture_number="001",
            title="소프트웨어 개발의 원리와 실습",
            subtitle="",
            credit=4,
            lecture_credit=2,
            lab_credit=1,
            lecture_type="",
            location="301동",
            professor="곤",
            quota="80",
            remark="로드가 많아요",
            language="영어",
            status="설강"
        )

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
        response = self.post_nocsrf('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_superuser(self):
        user = User.objects.get(id=1)
        self.assertEqual(str(user), 'cubec@gmail.com')
        self.assertEqual(user.is_staff, True)
        self.assertEqual(user.has_perm([]), True)
        self.assertEqual(user.has_module_perms([]), True)
    
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
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'Password': 'cubec2'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec2'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_put_signout(self):
        response = self.put('/api/signout/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 405)
    
    def test_get_signout(self):
        response = self.get('/api/signout/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/signout/')
        self.assertEqual(response.status_code, 204)

    def test_get_signin(self):
        response = self.get('/api/signin/')
        self.assertEqual(response.status_code, 405)

    def test_delete_user(self):
        response = self.delete('/api/user/')
        self.assertEqual(response.status_code, 405)

    def test_get_user(self):
        response = self.get('/api/user/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('cubec', response.content.decode())
        self.assertIn('grade', response.content.decode())

    def test_timetable(self):
        timetable = Timetable.objects.get(id=2)
        self.assertEqual(str(timetable), 'My timetable')

    def test_timetable_not_allowed(self):
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.put('/api/timetable/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/')
        self.assertEqual(response.status_code, 405)

    def test_get_timetable(self):
        response = self.get('/api/timetable/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/timetable/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(3, len(json.loads(response.content.decode())))

    def test_post_timetable(self):
        response = self.post('/api/timetable/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.post('/api/timetable/', json.dumps({}),
            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/timetable/', json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.get('/api/timetable/')
        self.assertEqual(4, len(json.loads(response.content.decode())))

    def test_timetable_id_not_allowed(self):
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.post('/api/timetable/1/')
        self.assertEqual(response.status_code, 405)

    def test_get_timetable_id(self):
        response = self.get('/api/timetable/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/timetable/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), '{"id": 1, "title": "My timetable", "semester": "", "user": 1, "courses": []}')
        response = self.get('/api/timetable/101/')
        self.assertEqual(response.status_code, 404)

    def test_put_timetable_id(self):
        response = self.put('/api/timetable/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.put('/api/timetable/1/', json.dumps({}),
            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/timetable/101/', json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.put('/api/timetable/1/', json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_put_timetable_id_diff_user(self):
        response = self.post('/api/signin/', json.dumps({'email': 'young', 'password': 'young'}),
            content_type='application/json')
        response = self.put('/api/timetable/1/', json.dumps({'title':'youngchan1', 'semester':'2019-s'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_delete_timetable_id(self):
        response = self.delete('/api/timetable/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        try:
            response = self.delete('/api/timetable/1/')
        except (ProtectedError):
            pass
        else:
            self.fail('Did not fail ProtectedError')
        response = self.delete('/api/timetable/101/')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/timetable/4/')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/timetable/')
        self.assertEqual(2, len(json.loads(response.content.decode())))

    def test_delete_timetable_id_diff_user(self):
        response = self.post('/api/signin/', json.dumps({'email': 'young', 'password': 'young'}),
            content_type='application/json')
        response = self.delete('/api/timetable/1/')
        self.assertEqual(response.status_code, 403)

    def test_timetable_id_course_not_allowed(self):
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.put('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 405)
        
    def test_get_timetable_id_course(self):
        response = self.get('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/timetable/101/course/')
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(0, len(json.loads(response.content.decode())))

    def test_post_timetable_id_course(self):
        response = self.post('/api/timetable/1/course/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
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
        response = self.get('/api/timetable/1/course/')
        self.assertEqual(1, len(json.loads(response.content.decode())))

    def test_course_not_allowed(self):
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.put('/api/course/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/course/')
        self.assertEqual(response.status_code, 405)
        
    def test_get_course(self):
        response = self.get('/api/course/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/course/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(1, len(json.loads(response.content.decode())))

    def test_post_course(self):
        response = self.post('/api/course/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.post('/api/course/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/course/', json.dumps({
            "semester":"2019-2", "classification":"전필", "college":"공과대학", "department":"컴퓨터공학부",
            "degree_program":"학사", "academic_year":3, "course_number":"M1522.002400", "lecture_number":"001",
            "title":"소프트웨어 개발의 원리와 실습","subtitle":"", "credit":4, "lecture_credit":2,
            "lab_credit":1, "lecture_type":"", "location":"301동", "professor":"곤", "quota":"80",
            "remark":"어려워요", "language":"영어", "status":"설강"}), 
            content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.get('/api/course/')
        self.assertEqual(2, len(json.loads(response.content.decode())))

    def test_course_id_not_allowed(self):
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.post('/api/course/1/')
        self.assertEqual(response.status_code, 405)

    def test_get_course_id(self):
        response = self.get('/api/course/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/course/101/')
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/course/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), {'id':1,
            "semester":"2019-2", "classification":"전필", "college":"공과대학", "department":"컴퓨터공학부",
            "degree_program":"학사", "academic_year":3, "course_number":"M1522.002400", "lecture_number":"001",
            "title":"소프트웨어 개발의 원리와 실습","subtitle":"", "credit":4, "lecture_credit":2,
            "lab_credit":1, "lecture_type":"", "location":"301동", "professor":"곤", "quota":"80",
            "remark":"로드가 많아요", "language":"영어", "status":"설강"})

    def test_put_course_id(self):
        response = self.put('/api/course/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.put('/api/course/101/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.put('/api/course/1/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/course/1/', json.dumps({
            "semester":"2019-2", "classification":"전필", "college":"공과대학", "department":"컴퓨터공학부",
            "degree_program":"학사", "academic_year":3, "course_number":"M1522.002400", "lecture_number":"001",
            "title":"소프트웨어 개발의 원리와 실습","subtitle":"", "credit":4, "lecture_credit":2,
            "lab_credit":1, "lecture_type":"", "location":"301동", "professor":"곤", "quota":"80",
            "remark":"어려워요", "language":"영어", "status":"설강"}), 
            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/course/1/')
        self.assertEqual(json.loads(response.content.decode()), {'id':1,
            "semester":"2019-2", "classification":"전필", "college":"공과대학", "department":"컴퓨터공학부",
            "degree_program":"학사", "academic_year":3, "course_number":"M1522.002400", "lecture_number":"001",
            "title":"소프트웨어 개발의 원리와 실습","subtitle":"", "credit":4, "lecture_credit":2,
            "lab_credit":1, "lecture_type":"", "location":"301동", "professor":"곤", "quota":"80",
            "remark":"어려워요", "language":"영어", "status":"설강"})

    def test_delete_course_id(self):
        response = self.delete('/api/course/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.delete('/api/course/101/')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/course/1/')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/course/')
        self.assertEqual(0, len(json.loads(response.content.decode())))


    def test_get_verify(self):
        user = User.objects.create_user(email='1207koo@gmail.com', password='koo', username='KOO')
        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        token = account_activation_token.make_token(user)
        response = self.get('/api/verify/{}/0000000-0000000/'.format(uidb64))
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/verify/0/{}/'.format(token))
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/verify/{}/{}/'.format(uidb64, token))
        self.assertEqual(response.status_code, 204)
    
    def test_delete_verify(self):
        user = User.objects.create_user(email='1207koo@gmail.com', password='koo', username='KOO')
        response = self.delete('/api/verify/0/0000000-0000000/')
        self.assertEqual(response.status_code, 405)

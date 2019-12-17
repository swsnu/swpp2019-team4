import json
from django.test import TestCase, Client
from assaapp.models import User, Course, Building, CourseTime
from recommend.models import CoursePref, TimePref

class RecommendTestCase(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.user_set = []
        self.user_set.append(User.objects.create_superuser(
            email='koo@snu.ac.kr', password='koo', username='Koo Junseo'))
        self.user_set.append(User.objects.create_superuser(
            email='cubec@gmail.com', password='cubec', username='Jung Jaeyun'))
        self.user_set.append(User.objects.create_user(
            email='khsoo@gmail.com', password='khsoo', username='Kim Hyunsoo'))
        self.user_set.append(User.objects.create_superuser(
            email='young@naver.com', password='young', username='Kim Youngchan'))
        self.user_set.append(User.objects.create_user(
            email='assa.staff@gmail.com', password='assaapp', username='SWPP'))

        for i in range(10):
            Course.objects.create(
                title="swpp",
                credit=i + 1,
            )

    def get(self, *args, **kwargs):
        return self.client.get(*args, **kwargs)

    def post(self, *args, **kwargs):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
        return self.client.post(*args, **kwargs, HTTP_X_CSRFTOKEN=csrftoken)

    def delete(self, *args, **kwargs):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
        return self.client.delete(*args, **kwargs, HTTP_X_CSRFTOKEN=csrftoken)

    def put(self, *args, **kwargs):
        response = self.client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
        return self.client.put(*args, **kwargs, HTTP_X_CSRFTOKEN=csrftoken)

    def test_get_cf(self):
        response = self.get('/api/recommend/coursepref/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/coursepref/')
        self.assertEqual(response.status_code, 405)
        CoursePref(user=User.objects.get(id=4),
                   course=Course.objects.get(id=2), score=0).save()
        CoursePref(user=User.objects.get(id=3),
                   course=Course.objects.get(id=2), score=0).save()
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=1), score=10).save()
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=2), score=10).save()
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=3), score=0).save()
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=4), score=0).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=2), score=10).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=5), score=0).save()
        response = self.get('/api/recommend/coursepref/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(2, len(json.loads(response.content.decode())))
        self.assertEqual(10, json.loads(response.content.decode())[0]['score'])

    def test_get_coursepref(self):
        response = self.get('/api/recommend/coursepref/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/coursepref/1/')
        self.assertEqual(response.status_code, 405)
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=1), score=5).save()
        response = self.get('/api/recommend/coursepref/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(5, json.loads(response.content.decode())['score'])
        response = self.get('/api/recommend/coursepref/2/')
        self.assertEqual(response.status_code, 404)

    def test_put_coursepref(self):
        response = self.put('/api/recommend/coursepref/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.put('/api/recommend/coursepref/', json.dumps({}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/recommend/coursepref/',
                            json.dumps({'courses':[{'id':1, 'score':5}, {'id':2, 'score':7}]}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.put('/api/recommend/coursepref/',
                            json.dumps({'courses':[{'id':1, 'score':7}, {'id':2, 'score':7}]}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/coursepref/1/')
        expected = {'id':1, 'user':1, 'course':1, 'score':7}
        self.assertEqual(expected, json.loads(response.content.decode()))

    def test_put_coursepref_id(self):
        response = self.put('/api/recommend/coursepref/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.put('/api/recommend/coursepref/1/', json.dumps({}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/recommend/coursepref/1/',
                            json.dumps({'score':-1}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/recommend/coursepref/20/',
                            json.dumps({'score':5}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.put('/api/recommend/coursepref/1/',
                            json.dumps({'score':5}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.put('/api/recommend/coursepref/1/',
                            json.dumps({'score':1}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/coursepref/1/')
        expected = {'id':1, 'user':1, 'course':1, 'score':1}
        self.assertEqual(expected, json.loads(response.content.decode()))

    def test_delete_coursepref(self):
        response = self.delete('/api/recommend/coursepref/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.delete('/api/recommend/coursepref/1/', json.dumps({}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.put('/api/recommend/coursepref/1/',
                            json.dumps({'score':5}),
                            content_type='application/json')
        response = self.delete('/api/recommend/coursepref/99/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/recommend/coursepref/1/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/coursepref/1/')
        self.assertEqual(response.status_code, 404)


    def test_get_timepref(self):
        response = self.get('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 405)
        TimePref(user=User.objects.get(id=1),
                 weekday=0,
                 start_time="12:00",
                 score=0).save()
        TimePref(user=User.objects.get(id=1),
                 weekday=0,
                 start_time="12:30",
                 score=1).save()
        TimePref(user=User.objects.get(id=2),
                 weekday=0,
                 start_time="12:00",
                 score=2).save()
        response = self.get('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(26, len(json.loads(response.content.decode())))
        self.assertEqual(1, json.loads(response.content.decode())[9][0])

    def test_put_timepref(self):
        response = self.put('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'score': 3, 'weekday': 0, 'start_time':"12:00"}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'weekday':0, 'start_time':"12:00"}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        table = []
        table_row = [1, 1, 1, 1, 1, 1]
        for _ in range(26):
            table.append(table_row)
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'table':table}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(26, len(json.loads(response.content.decode())))
        self.assertEqual(1, json.loads(response.content.decode())[8][0])
        table = []
        table_row = [2, 2, 2, 2, 2, 2]
        for _ in range(26):
            table.append(table_row)
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'table':table}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(26, len(json.loads(response.content.decode())))
        self.assertEqual(2, json.loads(response.content.decode())[8][0])

    def test_get_timepref_id(self):
        response = self.get('/api/recommend/timepref/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/timepref/1/')
        self.assertEqual(response.status_code, 405)
        TimePref(user=User.objects.get(id=1),
                 weekday=1,
                 start_time="13:00",
                 score=3).save()
        TimePref(user=User.objects.get(id=2),
                 weekday=0,
                 start_time="12:00",
                 score=0).save()
        response = self.get('/api/recommend/timepref/2/')
        self.assertEqual(response.status_code, 404)
        response = self.get('/api/recommend/timepref/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(3, json.loads(response.content.decode())['score'])

    def test_delete_timepref(self):
        response = self.delete('/api/recommend/timepref/1/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.delete('/api/recommend/timepref/1/', json.dumps({}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 404)
        TimePref(user=User.objects.get(id=1),
                 weekday=5,
                 start_time="12:00",
                 score=2).save()
        response = self.delete('/api/recommend/timepref/99/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = self.delete('/api/recommend/timepref/1/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/timepref/1/')
        self.assertEqual(response.status_code, 404)

    def test_get_coursepref_rated(self):
        response = self.get('/api/recommend/coursepref/rated/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/coursepref/rated/')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/recommend/coursepref/rated/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/recommend/coursepref/rated/')
        self.assertEqual(response.status_code, 405)
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=1), score=7).save()
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=2), score=1).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=1), score=5).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=3), score=5).save()
        response = self.get('/api/recommend/coursepref/rated/?'+
                            'start=0&end=49&title=swpp&classification='+
                            '&department=&degree_program=&academic_year='+
                            '&course_number=&lecture_number=&professor='+
                            '&language=&min_credit=&max_credit=&min_score='+
                            '&max_score=&sort=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(2, len(json.loads(response.content.decode())))
        response = self.get('/api/recommend/coursepref/rated/?start=0&end=0'+
                            '&title=swpp&classification=&department='+
                            '&degree_program=&academic_year=&course_number='+
                            '&lecture_number=&professor=&language=&min_credit='+
                            '&max_credit=&min_score=&max_score=&sort=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(1, len(json.loads(response.content.decode())))

    def test_get_coursepref_unrated(self):
        response = self.get('/api/recommend/coursepref/unrated/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/coursepref/unrated/')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/recommend/coursepref/unrated/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/recommend/coursepref/unrated/')
        self.assertEqual(response.status_code, 405)
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=1), score=7).save()
        CoursePref(user=User.objects.get(id=2),
                   course=Course.objects.get(id=2), score=5).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=1), score=5).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=3), score=5).save()
        response = self.get('/api/recommend/coursepref/unrated/?start=0'+
                            '&end=49&title=swpp&classification=&department='+
                            '&degree_program=&academic_year=&course_number='+
                            '&lecture_number=&professor=&language=&min_credit='+
                            '&max_credit=&min_score=&max_score=&sort=0')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(8, len(json.loads(response.content.decode())))
        response = self.get('/api/recommend/coursepref/unrated/?start=0'+
                            '&end=0&title=swpp&classification=&department='+
                            '&degree_program=&academic_year=&course_number='+
                            '&lecture_number=&professor=&language=&min_credit='+
                            '&max_credit=&min_score=&max_score=&sort=0')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(1, len(json.loads(response.content.decode())))

    def test_put_constraints(self):
        response = self.put('/api/recommend/constraints/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/constraints/')
        self.assertEqual(response.status_code, 405)
        response = self.delete('/api/recommend/constraints/')
        self.assertEqual(response.status_code, 405)
        response = self.put('/api/recommend/constraints/',
                            json.dumps({'days_per_week':4,
                                        'credit_min':1,
                                        'credit_max':12,
                                        'major_min':1,
                                        'major_max':13, }),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.put('/api/recommend/constraints/',
                            json.dumps({'days_per_week':4,
                                        'credit_min':3,
                                        'credit_max':5,
                                        'major_min':1,
                                        'major_max':2, }),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.put('/api/recommend/constraints/',
                            json.dumps({}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_recommend(self):
        response = self.get('/api/recommend/recommend/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.get('/api/recommend/recommend/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(0, len(json.loads(response.content.decode())))
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=1), score=7).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=2), score=8).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=3), score=9).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=4), score=10).save()
        Building(name='A', repre_name='A', latitude=37, longitude=127).save()
        Building(name='B', repre_name='B', latitude=37.0000001, longitude=127.0000001).save()
        Building(name='C', repre_name='C', latitude=37.01, longitude=127.01).save()
        CourseTime(course=Course.objects.get(id=1),
                   building=Building.objects.get(id=1),
                   lectureroom='home',
                   weekday=0,
                   start_time="12:00",
                   end_time="13:00").save()
        CourseTime(course=Course.objects.get(id=2),
                   building=Building.objects.get(id=2),
                   lectureroom='home',
                   weekday=0,
                   start_time="13:00",
                   end_time="14:00").save()
        CourseTime(course=Course.objects.get(id=3),
                   building=Building.objects.get(id=3),
                   lectureroom='home',
                   weekday=0,
                   start_time="14:00",
                   end_time="15:00").save()
        CourseTime(course=Course.objects.get(id=4),
                   building=Building.objects.get(id=3),
                   lectureroom='home',
                   weekday=0,
                   start_time="14:00",
                   end_time="15:00").save()
        response = self.get('/api/recommend/recommend/')
        self.assertEqual(response.status_code, 200)

    def test_post_recommend(self):
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.post('/api/recommend/recommend/')
        self.assertEqual(1, len(json.loads(response.content.decode())))
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=1), score=7).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=2), score=8).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=3), score=9).save()
        CoursePref(user=User.objects.get(id=1),
                   course=Course.objects.get(id=4), score=10).save()
        Building(name='A', repre_name='A', latitude=37, longitude=127).save()
        Building(name='B', repre_name='B', latitude=37.0000001, longitude=127.0000001).save()
        Building(name='C', repre_name='C', latitude=37.01, longitude=127.01).save()
        CourseTime(course=Course.objects.get(id=1),
                   building=Building.objects.get(id=1),
                   lectureroom='home',
                   weekday=0,
                   start_time="12:00",
                   end_time="13:00").save()
        CourseTime(course=Course.objects.get(id=2),
                   building=Building.objects.get(id=2),
                   lectureroom='home',
                   weekday=0,
                   start_time="13:00",
                   end_time="14:00").save()
        CourseTime(course=Course.objects.get(id=3),
                   building=Building.objects.get(id=3),
                   lectureroom='home',
                   weekday=0,
                   start_time="14:00",
                   end_time="15:00").save()
        CourseTime(course=Course.objects.get(id=4),
                   building=Building.objects.get(id=3),
                   lectureroom='home',
                   weekday=0,
                   start_time="14:00",
                   end_time="15:00").save()
        response = self.post('/api/recommend/recommend/')
        response = self.get('/api/recommend/recommend/')
        self.assertEqual(response.status_code, 200)

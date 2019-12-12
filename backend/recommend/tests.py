import json
from django.test import TestCase, Client
from assaapp.models import User, Course
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
                credit=i,
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
        self.assertEqual(2, len(json.loads(response.content.decode())))
        self.assertEqual(0, json.loads(response.content.decode())[0]['score'])

    def test_put_timepref(self):
        response = self.put('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/',
                             json.dumps({'email': 'koo@snu.ac.kr', 'password': 'koo'}),
                             content_type='application/json')
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'score':-1, 'weekday':0, 'start_time':"12:00"}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'weekday':0, 'start_time':"12:00"}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        table=[]
        table_row=[1,1,1,1,1,1]
        for i in range(26):
            table.append(table_row)
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'table':table}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(156, len(json.loads(response.content.decode())))
        self.assertEqual(1, json.loads(response.content.decode())[0]['score'])
        table=[]
        table_row=[2,2,2,2,2,2]
        for i in range(26):
            table.append(table_row)
        response = self.put('/api/recommend/timepref/',
                            json.dumps({'table':table}),
                            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.get('/api/recommend/timepref/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(156, len(json.loads(response.content.decode())))
        self.assertEqual(2, json.loads(response.content.decode())[0]['score'])

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

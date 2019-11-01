from django.test import TestCase, Client
from assaapp.models import User, Timetable
from assaapp.tokens import account_activation_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
import json
    
class AssaTestCase(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        user1 = User.objects.create_superuser(email='cubec@gmail.com', password='cubec', username='Jung Jaeyun')
        user2 = User.objects.create_user(email='khsoo@gmail.com', password='khsoo', username='Kim Hyunsoo')
        timetable1 = Timetable.objects.create(title='21', user=user1)
        timetable2 = Timetable.objects.create(title='22', user=user1)

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

    def test_get_timetable(self):
        response = self.get('/api/timetable/')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec@gmail.com', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/timetable/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(3, len(json.loads(response.content.decode())))

    def test_delete_timetable(self):
        response = self.delete('/api/timetable/')
        self.assertEqual(response.status_code, 405)

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

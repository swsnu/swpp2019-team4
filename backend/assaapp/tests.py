from django.test import TestCase, Client
from assaapp.models import User
import json
    
class AssaTestCase(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        user = User.objects.create_user(email='cubec', password='cubec', username='Jung Jaeyun')

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
        response = self.post_nocsrf('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 403)
    
    def test_post_signin(self):
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'Password': 'cubec2'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec2'}),
            content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
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
        response = self.post('/api/signin/', json.dumps({'email': 'cubec', 'password': 'cubec'}),
            content_type='application/json')
        response = self.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('cubec', response.content.decode())
        self.assertIn('grade', response.content.decode())
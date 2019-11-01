from django.db.utils import IntegrityError
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from assaapp.models import User, Timetable
from json import JSONDecodeError
from .tokens import account_activation_token
import json

def signup(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            email = req_data['email']
            password = req_data['password']
            username = req_data['username']
            str_detail = ['grade', 'department']
            req_detail = {}
            for detail in str_detail:
                if detail in req_data:
                    req_detail[detail] = req_data[detail]
            user = User.objects.create_user(email=email, password=password, username=username, **req_detail)
            content = 'Hi, {}.\nhttp://localhost:3000/verify/{}/{}\n'.format(
                username,
                urlsafe_base64_encode(force_bytes(user.id)),
                account_activation_token.make_token(user)
            )
            email = EmailMessage('Confirm your email from ASSA', content, to=[email])
            email.send()
        except (KeyError, JSONDecodeError, IntegrityError) as e:
            return HttpResponseBadRequest()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def verify(request, uidb64, token):
    if request.method == 'GET':
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return HttpResponse(status=204)
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseNotAllowed(['GET'])

def signin(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            email = req_data['email']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

def signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

def user(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            user = {'email': request.user.email, 'username': request.user.username, 
                'grade': request.user.grade, 'department': request.user.department,
                'is_authenticated': True}
            return JsonResponse(user)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

def timetable(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            timetables = [timetable for timetable in Timetable.objects.filter(user__id=request.user.id).values()]
            return JsonResponse(timetables, safe=False)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
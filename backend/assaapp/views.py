from django.db.utils import IntegrityError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from assaapp.models import User, Timetable
from json import JSONDecodeError
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
            User.objects.create_user(email=email, password=password, username=username, **req_detail)
        except (KeyError, JSONDecodeError, IntegrityError) as e:
            return HttpResponseBadRequest()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

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
    if request.user.is_authenticated:
        if request.method == 'GET':
            timetables = [timetable for timetable in Timetable.objects.filter(user__id=request.user.id).values()]
            return JsonResponse(timetables, safe=False)
        if request.method == 'POST':
            try:
                req_data = json.loads(request.body.decode())
                timetable_title = req_data['title']
                timetable_semester = req_data['semester']
                timetable = Timetable(title=timetable_title, semester=timetable_semester, user=request.user)
                timetable.save()
                return HttpResponse(status=201)
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
        else:
            return HttpResponseNotAllowed(['GET', 'POST'])
    else:
        return HttpResponse(status=403)

def timetable_id(request, timetable_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            timetable_list = [timetable for timetable in Timetable.objects.all().values() if timetable['id'] == timetable_id]
            if len(timetable_list) == 0:
                return HttpResponseNotFound()
            else:
                return JsonResponse(timetable_list[0], safe=False)
        if request.method == 'PUT':
            try:
                body = request.body.decode()
                timetable_title = json.load(body)['title']
                timetable_semester = json.load(body)['semester']
                timetable_list = [timetable for timetable in Timetable.objects.all().values() if timetable['id'] == timetable_id]
                if len(timetable_list) == 0:
                    return HttpResponseNotFound()
                timetable = Timetable.objects.get(pk=article_id)
                if timetable.user == request.user
                    timetable.title = timetable_title
                    timetable.semester = timetable_semester
                    timetable.save()
                    return JsonResponse(model_to_dict(timetable), status=200)
                else:
                    return HttpResponse(status=403)
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
    else:
        return HttpResponse(status=403)
            
@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
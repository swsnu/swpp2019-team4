from django.db.utils import IntegrityError
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import EmailMessage
from django.forms.models import model_to_dict
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from assaapp.models import User, Timetable, Course
from json import JSONDecodeError
from .tokens import account_activation_token
import json
import logging

def make_course(req_data, course):
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

    if course == None:
        course = Course(**req_detail)
        return course
    else:
        Course.objects.filter(id=course.id).update(**req_detail)
        return Course.objects.get(id=course.id)

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
            content = 'Hi, {}.\nhttp://localhost:8000/api/verify/{}/{}\n'.format(
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
        return HttpResponse(status=401)

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
                timetable_title = json.loads(body)['title']
                timetable_semester = json.loads(body)['semester']
                timetable_list = [timetable for timetable in Timetable.objects.all().values() if timetable['id'] == timetable_id]
                if len(timetable_list) == 0:
                    return HttpResponseNotFound()
                timetable = Timetable.objects.get(pk=timetable_id)
                if timetable.user == request.user:
                    timetable.title = timetable_title
                    timetable.semester = timetable_semester
                    timetable.save()
                    return JsonResponse(model_to_dict(timetable), status=200)
                else:
                    return HttpResponse(status=403)
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
        if request.method == 'DELETE':
            timetable_list = [timetable for timetable in Timetable.objects.all().values() if timetable['id'] == timetable_id]
            if len(timetable_list) == 0:
                return HttpResponseNotFound()
            timetable = Timetable.objects.get(pk=timetable_id)
            if timetable.user.id == request.user.id:
                timetable.delete()
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
    else:
        return HttpResponse(status=401)

def timetable_id_course(request, timetable_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            timetable_list = [timetable for timetable in Timetable.objects.all().values() if timetable['id'] == timetable_id]
            if len(timetable_list) == 0:
                return HttpResponseNotFound()
            timetable = Timetable.objects.get(pk=timetable_id)
            courses = [course for course in timetable.courses.all().values()]
            return JsonResponse(courses, status=200, safe=False)
        if request.method == 'POST':
            try:
                body = request.body.decode()
                course_id = json.loads(body)['course_id']
                timetable_list = [timetable for timetable in Timetable.objects.all().values() if timetable['id'] == timetable_id]
                if len(timetable_list) == 0:
                    return HttpResponseNotFound()
                timetable = Timetable.objects.get(pk=timetable_id)
                course_list = [course for course in Course.objects.all().values() if course['id'] == course_id]
                if len(course_list) == 0:
                    return HttpResponseNotFound()
                course = Course.objects.get(pk=course_id)
                timetable.courses.add(course)
                timetable.save()
                return HttpResponse(status = 200)
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
        else:
            return HttpResponseNotAllowed(['GET'],['POST'])
    else:
        return HttpResponse(status=401)

def course(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            course_list = [course for course in Course.objects.all().values()]
            return JsonResponse(course_list, safe=False)
        if request.method == 'POST':
            try:
                req_data = json.loads(request.body.decode())
                course = make_course(req_data, None)
                course.save()
                return HttpResponse(status=201)
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
        else:
            return HttpResponseNotAllowed(['GET'])
    else:
        return HttpResponse(status=401)

def course_id(request, course_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            course_list = [course for course in Course.objects.all().values() if course['id'] == course_id]
            if len(course_list) == 0:
                return HttpResponseNotFound()
            course = Course.objects.get(pk=course_id)
            return JsonResponse(model_to_dict(course), status=200)
        if request.method == 'PUT':
            req_data = json.loads(request.body.decode())
            course_list = [course for course in Course.objects.all().values() if course['id'] == course_id]
            if len(course_list) == 0:
                return HttpResponseNotFound()
            course = Course.objects.get(pk=course_id)
            course = make_course(req_data, course)
            course.save()
            return JsonResponse(model_to_dict(course),status=200)
        if request.method == 'DELETE':
            course_list = [course for course in Course.objects.all().values() if course['id'] == course_id]
            if len(course_list) == 0:
                return HttpResponseNotFound()
            course = Course.objects.get(pk=course_id)
            course.delete()
            return HttpResponse(status=200)
        else:
            return HttpResponseNotAllowed(['GET'])
    else:
        return HttpResponse(status=401)
@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
import json
from json import JSONDecodeError
from django.db.utils import IntegrityError
from django.http import HttpResponse, HttpResponseNotAllowed, \
    JsonResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import EmailMessage
from django.forms.models import model_to_dict
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from assaapp.models import User, Timetable, Course
from .tokens import ACCOUNT_ACTIVATION_TOKEN

def api_signup(request):
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
            user = User.objects.create_user(email=email, password=password,
                                            username=username, **req_detail)
            content = 'Hi, {}.\nhttp://localhost:3000/verify/{}/{}\n'.format(
                username,
                urlsafe_base64_encode(force_bytes(user.id)),
                ACCOUNT_ACTIVATION_TOKEN.make_token(user)
            )
            email = EmailMessage('Confirm your email for ASSA', content, to=[email])
            email.send()
        except (KeyError, ValueError, JSONDecodeError, IntegrityError):
            return HttpResponseBadRequest()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def api_verify(request, uidb64, token):
    if request.method == 'GET':
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and ACCOUNT_ACTIVATION_TOKEN.check_token(user, token):
            user.is_active = True
            user.save()
            return HttpResponse(status=204)
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseNotAllowed(['GET'])

def api_signin(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            email = req_data['email']
            password = req_data['password']
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

def api_signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

def api_user(request):
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

def api_timetable(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            timetables = [timetable for timetable in
                          Timetable.objects.filter(user__id=request.user.id).values()]
            return JsonResponse(timetables, safe=False)
        elif request.method == 'POST':
            try:
                req_data = json.loads(request.body.decode())
                timetable_title = req_data['title']
                timetable_semester = req_data['semester']
                timetable = Timetable(title=timetable_title,
                                      semester=timetable_semester, user=request.user)
                timetable.save()
                return HttpResponse(status=201)
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
        else:
            return HttpResponseNotAllowed(['GET', 'POST'])
    else:
        return HttpResponse(status=401)

def api_timetable_id(request, timetable_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            try:
                timetable = model_to_dict(Timetable.objects.get(id=timetable_id))
            except Timetable.DoesNotExist:
                return HttpResponseNotFound()
            else:
                return JsonResponse(timetable)
        elif request.method == 'PUT':
            try:
                body = request.body.decode()
                timetable_title = json.loads(body)['title']
                timetable_semester = json.loads(body)['semester']
                try:
                    timetable = Timetable.objects.get(id=timetable_id)
                    if timetable.user == request.user:
                        timetable.title = timetable_title
                        timetable.semester = timetable_semester
                        timetable.save()
                        return JsonResponse(model_to_dict(timetable), status=200)
                    else:
                        return HttpResponseForbidden()
                except Timetable.DoesNotExist:
                    return HttpResponseNotFound()
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
        elif request.method == 'DELETE':
            if timetable_id == request.user.timetable_main.id:
                return HttpResponseBadRequest()
            try:
                timetable = Timetable.objects.get(id=timetable_id)
                if timetable.user == request.user:
                    timetable.delete()
                    return HttpResponse(status=200)
                else:
                    return HttpResponseForbidden()
            except Timetable.DoesNotExist:
                return HttpResponseNotFound()
        else:
            return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
    else:
        return HttpResponse(status=401)

def api_timetable_id_course(request, timetable_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            try:
                timetable = Timetable.objects.get(pk=timetable_id)
                courses = [course for course in timetable.courses.all().values()]
                return JsonResponse(courses, status=200, safe=False)
            except Timetable.DoesNotExist:
                return HttpResponseNotFound()
        elif request.method == 'POST':
            try:
                body = request.body.decode()
                course_id = json.loads(body)['course_id']
                try:
                    timetable = Timetable.objects.get(pk=timetable_id)
                    course = Course.objects.get(pk=course_id)
                    timetable.courses.add(course)
                    timetable.save()
                    return HttpResponse(status=200)
                except (Timetable.DoesNotExist, Course.DoesNotExist):
                    return HttpResponseNotFound()
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
        else:
            return HttpResponseNotAllowed(['GET', 'POST'])
    else:
        return HttpResponse(status=401)

def api_course(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            course_list = [course for course in Course.objects.all().values()]
            return JsonResponse(course_list, safe=False)
        else:
            return HttpResponseNotAllowed(['GET'])
    else:
        return HttpResponse(status=401)

def api_course_id(request, course_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            try:
                course = Course.objects.get(pk=course_id)
                return JsonResponse(model_to_dict(course), status=200)
            except Course.DoesNotExist:
                return HttpResponseNotFound()
        else:
            return HttpResponseNotAllowed(['GET'])
    else:
        return HttpResponse(status=401)

@ensure_csrf_cookie
def api_token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

import json
import random
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
from assaapp.models import User, Timetable, Course, CourseColor, CourseTime
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
        return HttpResponseNotFound()
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
        return HttpResponse(status=401)
    return HttpResponseNotAllowed(['POST'])

def api_signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        return HttpResponse(status=401)
    return HttpResponseNotAllowed(['GET'])

def api_user(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            return JsonResponse(request.user.data_large())
        return HttpResponseNotAllowed(['GET'])
    return HttpResponse(status=401)

def api_user_friend(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            friend = [user.data_medium() for user in request.user.friends.all()]
            friend_receive = [user.data_small() for user in request.user.friends_request.all()]
            friend_send = [user.data_small() for user in
                           User.objects.filter(friends_request__in=[request.user.id])]
            return JsonResponse({'friend': friend, 'friend_send': friend_send,
                                 'friend_receive': friend_receive})
        return HttpResponseNotAllowed(['GET'])
    return HttpResponse(status=401)

def api_user_friend_id(request, user_id):
    '''
    POST :
    Accept as a friend only when the opponent sent a request.
    Otherwise, it will be considered as a bad request.
    DELETE :
    Simply put, remove all connections between two users.
    If a user got friend request from (user_id),
    this request is considered as a friend disapproval.
    If a user is a friend of (user_id)
    just delete a user from the friend list.
    '''
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                friend = request.user.friends_request.get(id=user_id)
                request.user.friends_request.remove(friend)
                request.user.friends.add(friend)
            except User.DoesNotExist:
                return HttpResponseNotFound()
            return JsonResponse(friend.data_medium())
        if request.method == 'DELETE':
            try:
                friend = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return HttpResponseNotFound()
            request.user.friends.remove(friend)
            request.user.friends_request.remove(friend)
            friend.friends_request.remove(request.user)
            return HttpResponse(status=204)
        return HttpResponseNotAllowed(['POST', 'DELETE'])
    return HttpResponse(status=401)

def api_user_search(request):
    '''
    This api is to send friend request to the opponent using email address.
    If the email address is a user's, then the api fails with USER error.
    If the opponent already sent a request, then connects as a friend relationship.
    If the user already sent a request, then the api fails with SENT error.
    If the user is already a friend of the opponent, then the api fails with FRIEND error.
    '''
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                req_data = json.loads(request.body.decode())
                email = req_data['email']
                friend = User.objects.get(email=email)
            except (KeyError, JSONDecodeError, User.DoesNotExist):
                return HttpResponseNotFound(content='NULL')
            user = request.user
            if user == friend:
                return HttpResponseBadRequest(content='USER')
            if user.friends.filter(id=friend.id).count() == 1:
                return HttpResponseBadRequest(content='FRIEND')
            if friend.friends_request.filter(id=user.id).count() == 1:
                return HttpResponseBadRequest(content='SENT')
            if user.friends_request.filter(id=friend.id).count() == 1:
                user.friends_request.remove(friend)
                user.friends.add(friend)
                return JsonResponse({'user': friend.data_medium(), 'status': 'FRIEND'})
            friend.friends_request.add(user)
            return JsonResponse({'user': friend.data_medium(), 'status': 'PENDING'})
        return HttpResponseNotAllowed(['POST'])
    return HttpResponse(status=401)

def api_timetable(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            timetables = [timetable for timetable in
                          Timetable.objects.filter(user__id=request.user.id).values()]
            return JsonResponse(timetables, safe=False)
        if request.method == 'POST':
            try:
                req_data = json.loads(request.body.decode())
                timetable_title = req_data['title']
                timetable_semester = req_data['semester']
                timetable = Timetable(title=timetable_title,
                                      semester=timetable_semester, user=request.user)
                timetable.save()
                return JsonResponse(model_to_dict(timetable), status=201)
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
        return HttpResponseNotAllowed(['GET', 'POST'])
    return HttpResponse(status=401)

def api_timetable_data(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            timetables = [timetable for timetable in
                          Timetable.objects.filter(user__id=request.user.id)]
            timetable_list = []
            for timetable in timetables:
                courses_color = [course for
                                 course in CourseColor.objects.filter(timetable=timetable)]
                courses_data = []
                for course_data in courses_color:
                    for course_time in CourseTime.objects.filter(course=course_data.course):
                        courses_data.append(
                            {
                                'name': course_data.course.title,
                                'week_day': course_time.weekday,
                                'start_time': course_time.start_time.hour*60
                                              +course_time.start_time.minute,
                                'end_time': course_time.end_time.hour*60
                                            +course_time.end_time.minute,
                                'color': course_data.color,
                                'lecture_number': course_data.course.lecture_number,
                                'course_number': course_data.course.course_number,
                            }
                        )
                timetable_list.append(courses_data)
            return JsonResponse(timetable_list, safe=False)
        return HttpResponseNotAllowed(['GET'])
    return HttpResponse(status=401)


def api_timetable_id(request, timetable_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            try:
                timetable = model_to_dict(Timetable.objects.get(id=timetable_id))
            except Timetable.DoesNotExist:
                return JsonResponse([], status=404, safe=False)
            courses_color = [course for
                             course in CourseColor.objects.filter(timetable=timetable_id)]
            courses_data = []
            for course_data in courses_color:
                for course_time in CourseTime.objects.filter(course=course_data.course):
                    courses_data.append(
                        {
                            'name': course_data.course.title,
                            'week_day': course_time.weekday,
                            'start_time': course_time.start_time.hour*60
                                          +course_time.start_time.minute,
                            'end_time': course_time.end_time.hour*60
                                        +course_time.end_time.minute,
                            'color': course_data.color,
                            'lecture_number': course_data.course.lecture_number,
                            'course_number': course_data.course.course_number,
                        }
                    )
            return JsonResponse(courses_data, safe=False)
        if request.method == 'PUT':
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
                    return HttpResponseForbidden()
                except Timetable.DoesNotExist:
                    return HttpResponseNotFound()
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
        if request.method == 'DELETE':
            if timetable_id == request.user.timetable_main.id:
                return HttpResponseBadRequest()
            try:
                timetable = Timetable.objects.get(id=timetable_id)
                if timetable.user == request.user:
                    timetable.delete()
                    return HttpResponse(status=200)
                return HttpResponseForbidden()
            except Timetable.DoesNotExist:
                return HttpResponseNotFound()
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
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
        if request.method == 'POST':
            try:
                string_pool = "89ABCDEF"
                color = "#"
                i = 1
                while i <= 6:
                    color += random.choice(string_pool)
                    i += 1
                body = request.body.decode()
                course_id = json.loads(body)['course_id']
                try:
                    timetable = Timetable.objects.get(pk=timetable_id)
                    course = Course.objects.get(pk=course_id)
                    CourseColor(timetable=timetable, course=course, color=color).save()
                    timetable.save()
                    courses_color = [course for
                                    course in CourseColor.objects.filter(timetable=timetable_id)]
                    courses_data = []
                    for course_data in courses_color:
                        for course_time in CourseTime.objects.filter(course=course_data.course):
                            courses_data.append(
                                {
                                    'name': course_data.course.title,
                                    'week_day': course_time.weekday,
                                    'start_time': course_time.start_time.hour*60
                                                +course_time.start_time.minute,
                                    'end_time': course_time.end_time.hour*60
                                                +course_time.end_time.minute,
                                    'color': course_data.color,
                                    'lecture_number': course_data.course.lecture_number,
                                    'course_number': course_data.course.course_number,
                                }
                            )
                    return JsonResponse(courses_data, safe=False)
                except (Timetable.DoesNotExist, Course.DoesNotExist):
                    return HttpResponseNotFound()
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
        return HttpResponseNotAllowed(['GET', 'POST'])
    return HttpResponse(status=401)

def api_course(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            course_list = [course for course in Course.objects.values()]
            if len(request.GET.get('title')) > 0 :
                match_text = request.GET.get('title')
                def is_matched (text) :
                    matched = 0
                    for i in range(len(text)) :
                        if matched == len(match_text) :
                            return True
                        if text[i] == match_text[matched] :
                            matched += 1
                    return False
                course_list = list(filter(lambda x : is_matched(x['title']), course_list))
            return JsonResponse(course_list, safe=False)
        return HttpResponseNotAllowed(['GET'])
    return HttpResponse(status=401)

@ensure_csrf_cookie
def api_token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    return HttpResponseNotAllowed(['GET'])

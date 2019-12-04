import math
import json
from json import JSONDecodeError
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseNotAllowed, \
    JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from assaapp.models import User, Course
from recommend.models import CoursePref, TimePref

def collaborative_filtering(user):
    all_course = [course.id for course in Course.objects.all()]
    all_coursepref = [model_to_dict(score_data) for score_data in CoursePref.objects.all()]
    user_coursepref = [model_to_dict(score_data) for score_data in CoursePref.objects.filter(user=user)]
    all_user = [person.id for person in User.objects.all()]
    user_id = user.id

    course_size=len(all_course)

    user_score={}
    user_sum={}
    user_one={}

    relation={}
    relation_sum=0.0
    relation_abs_sum=0.0

    course_score={}

    for person in all_user:
        user_sum[person]=0
        user_one[person]=0
    for course in all_course:
        user_score[course]=0
        course_score[course]=0.0
    for score_data in user_coursepref:
        user_score[score_data['course']]=1
    for score_data in all_coursepref:
        user_sum[score_data['user']]+=1
        if user_score[score_data['course']]==1:
            user_one[score_data['user']]+=1
    for person in all_user:
        if person==user_id:
            continue
        relation[person]=1.0-(2.0*user_sum[user_id]+2.0*user_sum[person]-4.0*user_one[person])/course_size
        relation_sum+=relation[person]
        relation_abs_sum+=abs(relation[person])
    for score_data in all_coursepref:
        if score_data['user']==user_id:
            continue
        course_score[score_data['course']]+=relation[score_data['user']]
    if relation_abs_sum==0.0:
        for course in all_course:
            course_score[course]=0.5
    else:
        relation_base=0.5-relation_sum/relation_abs_sum/2.0
        for course in all_course:
            course_score[course]=(course_score[course]/relation_abs_sum)+relation_base
    return course_score

def searcher(course, score, request_get):
    def has_text(text,match_text):
        if match_text:
            matched = 0
            for char in text:
                if char == match_text[matched]:
                    matched += 1
                if matched == len(match_text):
                    return True
            return False
        return True
    search_dict = {}
    search_dict['title'] = request_get.get('title')
    search_dict['classification'] = request_get.get('classification')
    search_dict['department'] = request_get.get('department')
    search_dict['degree_program'] = request_get.get('degree_program')
    search_dict['academic_year'] = request_get.get('academic_year')
    search_dict['course_number'] = request_get.get('course_number')
    search_dict['lecture_number'] = request_get.get('lecture_number')
    search_dict['professor'] = request_get.get('professor')
    search_dict['language'] = request_get.get('language')
    if request_get.get('max_credit'):
        search_dict['max_credit'] = int(request_get.get('max_credit'))
    else:
        search_dict['max_credit'] = 32
    if request_get.get('min_credit'):
        search_dict['min_credit'] = int(request_get.get('min_credit'))
    else:
        search_dict['min_credit'] = -32
    if request_get.get('max_score'):
        search_dict['max_score'] = float(request_get.get('max_score'))
    else:
        search_dict['max_score'] = 32.0
    if request_get.get('min_score'):
        search_dict['min_score'] = float(request_get.get('min_score'))
    else:
        search_dict['min_score'] = -32.0
    return (has_text(course.title+course.subtitle,search_dict['title']) and
            has_text(course.classification,search_dict['classification']) and
            has_text(course.college+course.department,search_dict['department']) and
            has_text(course.degree_program,search_dict['degree_program']) and
            has_text(course.academic_year,search_dict['academic_year']) and
            has_text(course.course_number,search_dict['course_number']) and
            has_text(course.lecture_number,search_dict['lecture_number']) and
            has_text(course.professor,search_dict['professor']) and
            has_text(course.language,search_dict['language']) and
            course.credit<=search_dict['max_credit'] and
            course.credit>=search_dict['min_credit'] and
            score<=search_dict['max_score'] and
            score>=search_dict['min_score'])

def auth_func(func):
    def wrapper_function(*args, **kwargs):
        if args[0].user.is_authenticated:
            return func(*args, **kwargs)
        return HttpResponse(status=401)
    return wrapper_function

@auth_func
def api_coursepref(request):
    if request.method == 'GET':
        cf_result=collaborative_filtering(request.user)
        rated={}
        course_list=[]
        all_course=[course.data_small() for course in Course.objects.all()]
        for course in all_course:
            rated[course['id']]=False
        for score_data in CoursePref.objects.filter(user=request.user):
            rated[score_data.course.id]=True
        for course in all_course:
            course_data=course
            course_data['rated']=rated[course['id']]
            course_data['score']=cf_result[course['id']]
            course_list.append(course_data)
        return JsonResponse(course_list, safe=False)
    if request.method == 'PUT':
        try:
            body=request.body.decode()
            courses=json.loads(body)['courses']
            print(courses)
            for course in courses:
                id = course['id']
                score = course['score']
                target_course = Course.objects.get(id=id)
                try:
                    score_data = CoursePref.objects.get(user=request.user, course=target_course)
                    score_data.score=score
                    score_data.save()
                except CoursePref.DoesNotExist:
                    new_score = CoursePref(user=request.user, course=target_course, score=score)
                    new_score.save()
            return HttpResponse(status=200)
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        except Course.DoesNotExist:
            return HttpResponseBadRequest()
        except CoursePref.DoesNotExist:
            new_score = CoursePref(user=request.user, course=course, score=score)
    return HttpResponseNotAllowed(['GET', 'PUT'])

@auth_func
def api_coursepref_rated(request):
    if request.method == 'GET':
        cf_result=collaborative_filtering(request.user)
        cf_user=[score_data for score_data in CoursePref.objects.filter(user=request.user)]
        start = int(request.GET.get('start'))
        end = int(request.GET.get('end'))
        position = 0
        course_list=[]
        for score_data in cf_user:
            if position>end:
                break
            course=score_data.course
            if position>=start and searcher(course,cf_result[course.id],request.GET):
                course_data=course.data()
                course_data['score']=score_data.score
                course_list.append(course_data)
            if searcher(course,cf_result[course.id],request.GET):
                position+=1
        return JsonResponse(course_list, safe=False)
    return HttpResponseNotAllowed(['GET'])

@auth_func
def api_coursepref_unrated(request):
    if request.method == 'GET':
        cf_result=collaborative_filtering(request.user)
        cf_user=[score_data.course.id for score_data in CoursePref.objects.filter(user=request.user)]
        start = int(request.GET.get('start'))
        end = int(request.GET.get('end'))
        position = 0
        rated={}
        course_list=[]
        all_course = [course for course in Course.objects.all()]
        all_course = sorted(all_course, key=lambda course: -cf_result[course.id])
        for course in all_course:
            rated[course.id]=False
        for score_data in cf_user:
            rated[score_data]=True
        for course in all_course:
            if position>end:
                break
            if position>=start and (not rated[course.id]) and searcher(course,cf_result[course.id],request.GET):
                course_data=course.data()
                course_list.append(course_data)
            if (not rated[course.id]) and searcher(course,cf_result[course.id],request.GET):
                position+=1
        return JsonResponse(course_list, safe=False)
    return HttpResponseNotAllowed(['GET'])

@auth_func
def api_coursepref_id(request, course_id):
    if request.method == 'GET':
        try:
            course = Course.objects.get(id=course_id)
            score_data = CoursePref.objects.get(user=request.user, course=course)
        except (Course.DoesNotExist, CoursePref.DoesNotExist):
            return JsonResponse({}, status=404, safe=False)
        return JsonResponse(model_to_dict(score_data), safe=False)
    if request.method == 'PUT':
        try:
            body = request.body.decode()
            score = int(json.loads(body)['score'])
            if score < 0 or score > 10:
                return HttpResponseBadRequest()
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({}, status=404, safe=False)
        try:
            score_data = CoursePref.objects.get(user=request.user, course=course)
            score_data.score = score
            score_data.save()
            return JsonResponse(model_to_dict(score_data), safe=False, status=200)
        except CoursePref.DoesNotExist:
            new_score = CoursePref(user=request.user, course=course, score=score)
            new_score.save()
            return JsonResponse(model_to_dict(new_score), safe=False, status=201)
    if request.method == 'DELETE':
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return HttpResponseNotFound()
        try:
            score_data = CoursePref.objects.get(user=request.user, course=course)
        except CoursePref.DoesNotExist:
            return HttpResponseNotFound()
        score_data.delete()
        return HttpResponse(status=200)
    return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

@auth_func
def api_timepref(request):
    if request.method == 'GET':
        time_data = [model_to_dict(each_data)
                     for each_data in TimePref.objects.filter(user=request.user)]
        return JsonResponse(time_data, safe=False)
    if request.method == 'PUT':
        try:
            body = request.body.decode()
            user = request.user
            score = int(json.loads(body)['score'])
            start_time = json.loads(body)['start_time']
            weekday = json.loads(body)['weekday']
            if score < 0 or score > 10:
                return HttpResponseBadRequest()
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        try:
            time_data = TimePref.objects.get(user=user, weekday=weekday, start_time=start_time)
        except TimePref.DoesNotExist:
            new_score = TimePref(user=user, score=score, weekday=weekday, start_time=start_time)
            new_score.save()
            return JsonResponse(model_to_dict(new_score), safe=False, status=201)
        time_data.score = score
        time_data.save()
        return JsonResponse(model_to_dict(time_data), safe=False, status=200)
    return HttpResponseNotAllowed(['GET', 'PUT'])

@auth_func
def api_timepref_id(request, timepref_id):
    if request.method == 'GET':
        try:
            time_data = TimePref.objects.get(id=timepref_id, user=request.user)
        except TimePref.DoesNotExist:
            return JsonResponse({}, status=404, safe=False)
        return JsonResponse(model_to_dict(time_data), safe=False)
    if request.method == 'DELETE':
        try:
            time_data = TimePref.objects.get(user=request.user, id=timepref_id)
        except TimePref.DoesNotExist:
            return HttpResponseNotFound()
        time_data.delete()
        return HttpResponse(status=200)
    return HttpResponseNotAllowed(['GET', 'DELETE'])

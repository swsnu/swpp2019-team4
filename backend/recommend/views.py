import math
import json
from json import JSONDecodeError
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseNotAllowed, \
    JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from assaapp.models import User, Course
from recommend.models import CoursePref, TimePref

def collaborative_filtering(user):
    all_course = [course for course in Course.objects.all().values()]
    all_coursepref = [score_data for score_data in CoursePref.objects.all().values()]
    user_coursepref = [score_data for score_data in CoursePref.objects.filter(user=user).values()]
    all_user = [person for person in User.objects.all().values()]
    user_dict = model_to_dict(user)

    score_sum = {}
    user_count = {}
    score_average = {}

    total_sum = 0.0
    total_count = 0.0
    total_average = 5.0

    total_square_sum = 0.0
    total_std = 1.0

    user_score_sum = {}
    user_score_square_sum = {}
    user_score_count = {}
    user_average = {}
    user_std = {}

    user_sum = {}
    person_sum = {}
    user_person_sum = {}
    relation = {}

    score_weighted_sum = {}
    relation_sum = {}

    score_result_dict = {}

    for course in all_course:
        score_sum[course['id']] = 0.0
        user_count[course['id']] = 0.0
        score_weighted_sum[course['id']] = 0.0
        relation_sum[course['id']] = 0.0
        score_result_dict[course['id']] = -2.0

    for person in all_user:
        user_sum[person['id']] = 0.0
        person_sum[person['id']] = 0.0
        user_person_sum[person['id']] = 0.0
        user_score_sum[person['id']] = 0.0
        user_score_count[person['id']] = 0.0
        user_score_square_sum[person['id']] = 0.0

    for score_data in all_coursepref:
        score_sum[score_data['course_id']] += score_data['score']
        user_count[score_data['course_id']] += 1.0
        user_score_sum[score_data['user_id']] += score_data['score']
        user_score_square_sum[score_data['user_id']] += score_data['score']**2
        user_score_count[score_data['user_id']] += 1.0
        total_sum += score_data['score']
        total_count += 1.0
        total_square_sum += score_data['score']**2

    if total_count > 0.0:
        total_average = round(total_sum/total_count, 3)
        if total_count > 1.0:
            val = total_square_sum/(total_count-1.0)-(total_average**2)*total_count/(total_count-1)
            total_std = math.sqrt(val)


    for course in all_course:
        usrcnt = user_count[course['id']]
        if usrcnt == 0.0:
            score_average[course['id']] = total_average
        else:
            score_average[course['id']] = score_sum[course['id']]/usrcnt

    for person in all_user:
        pid = person['id']
        score_square_sum = user_score_square_sum[pid]
        score_sum = user_score_sum[pid]
        score_cnt = user_score_count[pid]
        if score_cnt == 0.0:
            user_average[pid] = total_average
            user_std[pid] = total_std
        else:
            user_average[pid] = score_sum/score_cnt
            average = user_average[pid]
            if score_cnt > 1.0:
                val = score_square_sum/(score_cnt-1.0)-(average**2)*score_cnt/(score_cnt-1.0)
                user_std[pid] = math.sqrt(val)
            else:
                user_std[pid] = total_std

    for score_data in user_coursepref:
        score_result_dict[score_data['course_id']] = score_data['score']

    for score_data in all_coursepref:
        course = score_data['course_id']
        score = score_result_dict[course]
        person = score_data['user_id']
        if score > -1.0:
            user_delta = score-user_average[user_dict['id']]
            person_delta = score_data['score']-user_average[person]
            user_sum[person] += user_delta*user_delta
            person_sum[person] += person_delta*person_delta
            user_person_sum[person] += user_delta*person_delta

    for person in all_user:
        pid = person['id']
        usr_sum = user_sum[pid]
        persn_sum = person_sum[pid]
        usr_persn_sum = user_person_sum[pid]
        if usr_sum*persn_sum == 0.0:
            relation[pid] = 0.0
        else:
            relation[pid] = usr_persn_sum/math.sqrt(usr_sum*persn_sum)

    for score_data in all_coursepref:
        score_data_usr = score_data['user_id']
        rel = relation[score_data_usr]
        score_data_score = score_data['score']
        score_data_course = score_data['course_id']
        usr_average = user_average[score_data_usr]
        usr_std = user_std[score_data_usr]
        if usr_std != 0.0:
            score_weighted_sum[score_data_course] += rel*(score_data_score-usr_average)/usr_std
            relation_sum[score_data['course_id']] += abs(rel)

    for course in all_course:
        usr_std = user_std[user_dict['id']]
        weighted_sum = score_weighted_sum[course['id']]
        rel = relation_sum[course['id']]
        if score_result_dict[course['id']] < -1.0:
            if relation_sum[course['id']] == 0.0:
                score_result_dict[course['id']] = score_average[course['id']]
            else:
                val = weighted_sum*usr_std/rel+user_average[user_dict['id']]
                score_result_dict[course['id']] = round(val, 3)
        if score_result_dict[course['id']] < 0.0:
            score_result_dict[course['id']] = 0.0
        if score_result_dict[course['id']] > 10.0:
            score_result_dict[course['id']] = 10.0

    return score_result_dict

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
        search_dict['max_credit'] = (int)(request_get.get('max_credit'))
    else:
        search_dict['max_credit'] = 32
    if request_get.get('min_credit'):
        search_dict['min_credit'] = (int)(request_get.get('min_credit'))
    else:
        search_dict['min_credit'] = -32
    if request_get.get('max_score'):
        search_dict['max_score'] = (float)(request_get.get('max_score'))
    else:
        search_dict['max_score'] = 32.0
    if request_get.get('min_score'):
        search_dict['min_score'] = (float)(request_get.get('min_score'))
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
            course_data['except']=False
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
        start = (int)(request.GET.get('start'))
        end = (int)(request.GET.get('end'))
        position = 0
        rated={}
        course_list=[]
        all_course=[course for course in Course.objects.all()]
        for course in all_course:
            rated[course.id]=False
        for score_data in cf_user:
            rated[score_data.course.id]=True
        for course in all_course:
            if position>end:
                break
            elif position>=start and rated[course.id] and searcher(course,cf_result[course.id],request.GET):
                course_data=course.data()
                course_data['score']=cf_result[course.id]
                course_list.append(course_data)
            if rated[course.id] and searcher(course,cf_result[course.id],request.GET):
                position+=1
        return JsonResponse(course_list, safe=False)
    return HttpResponseNotAllowed(['GET'])

@auth_func
def api_coursepref_unrated(request):
    if request.method == 'GET':
        cf_result=collaborative_filtering(request.user)
        cf_user=[score_data for score_data in CoursePref.objects.filter(user=request.user)]
        start = (int)(request.GET.get('start'))
        end = (int)(request.GET.get('end'))
        position = 0
        rated={}
        course_list=[]
        all_course=[course for course in Course.objects.all()]
        for course in all_course:
            rated[course.id]=False
        for score_data in cf_user:
            rated[score_data.course.id]=True
        for course in all_course:
            if position>end:
                break
            elif position>=start and (not rated[course.id]) and searcher(course,cf_result[course.id],request.GET):
                course_data=course.data()
                course_data['score']=cf_result[course.id]
                course_list.append(course_data)
            if (not rated[course.id]) and searcher(course,cf_result[course.id],request.GET):
                position+=1
        return JsonResponse(course_list, safe=False)
    return HttpResponseNotAllowed(['GET'])

@auth_func
def api_coursepref_except(request):
    if request.method == 'GET':
        return JsonResponse([], safe=False)
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
            score = (int)(json.loads(body)['score'])
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
            score = (int)(json.loads(body)['score'])
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

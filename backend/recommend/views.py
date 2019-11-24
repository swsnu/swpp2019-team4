import math
import json
from json import JSONDecodeError
from assaapp.models import User, Course
from recommend.models import CoursePref
from django.http import HttpResponse, HttpResponseNotAllowed, \
    JsonResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.forms.models import model_to_dict

def collaborative_filtering(user):
    division_error=1.0/1048576.0
    all_course=[course for course in Course.objects.all()]
    all_coursepref=[score_data for score_data in CoursePref.objects.all()]
    user_coursepref=[score_data for score_data in CoursePref.objects.filter(user=user)]
    all_user=[person for person in User.objects.all()]
    score_sum={}
    user_count={}
    score_average={}
    user_sum={}
    person_sum={}
    user_person_sum={}
    relation={}
    score_weighted_sum={}
    relation_sum={}
    score_result_dict={}
    score_result=[]
    print('A')
    for course in all_course:
        score_sum[course.id]=0.0
        user_count[course.id]=0.0
        score_weighted_sum[course.id]=0.0
        relation_sum[course.id]=0.0
        score_result_dict[course.id]=-2.0
    print('B')
    for person in all_user:
        user_sum[person.id]=0.0
        person_sum[person.id]=0.0
        user_person_sum[person.id]=0.0
    print('C')
    for score_data in all_coursepref:
        score_sum[score_data.course.id]+=score_data.score
        user_count[score_data.course.id]+=1.0
    print('D')
    for course in all_course:
        score_average[course.id]=(score_sum[course.id]-5.0*user_count[course.id])/(user_count[course.id]+division_error)+5.0
    print('E')
    for score_data in user_coursepref:
        score_result_dict[score_data.course.id]=score_data.score
    print('F')
    for score_data in all_coursepref:
        course=score_data.course
        score=score_result_dict[course.id]
        person=score_data.user
        if score>-1:
            user_delta=score-score_average[course.id]
            person_delta=score_data.score-score_average[course.id]
            user_sum[person.id]+=user_delta*user_delta
            person_sum[person.id]+=person_delta*person_delta
            user_person_sum[person.id]+=user_delta*person_delta
    print('G')
    for person in all_user:
        relation[person.id]=user_person_sum[person.id]/(math.sqrt(user_sum[person.id]*person_sum[person.id])+division_error)
    print('H')
    for score_data in all_coursepref:
        relation_sum[score_data.course.id]+=relation[score_data.user.id]
        score_weighted_sum[score_data.course.id]+=score_data.score*relation[score_data.user.id]
    print('I')
    for course in all_course:
        if score_result_dict[course.id]<-1:
            score_result_dict[course.id]=(score_weighted_sum[course.id]-score_average[course.id]*relation_sum[course.id])/(relation_sum[course.id]+division_error)+score_average[course.id]
    print('J')
    for course in all_course:
        score_result.append({'course':course.id,'score':score_result_dict[course.id]})
    print('K')
    return score_result

def api_course_pref(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            return JsonResponse(collaborative_filtering(request.user), safe=False)
        return HttpResponseNotAllowed(['GET'])
    return HttpResponse(status=401)

def api_course_pref_id(request, course_id):
    if request.user.is_authenticated:
        if request.method == 'GET':
            try:
                course=Course.objects.get(id=course_id)
                score_data = CoursePref.objects.get(user=request.user,course=course)
            except (Course.DoesNotExist, CoursePref.DoesNotExist):
                return JsonResponse({}, status=404, safe=False)
            return JsonResponse(model_to_dict(score_data), safe=False)
        if request.method == 'PUT':
            try:
                body = request.body.decode()
                score = json.loads(body)['score']
                if score<0 or score>10:
                    return HttpResponseBadRequest()
            except (KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
            try:
                course=Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({}, status=404, safe=False)
            try:
                score_data=CoursePref.objects.get(user=request.user,course=course)
            except CoursePref.DoesNotExist:
                new_score=CoursePref(user=request.user,course=course,score=score)
                new_score.save()
                return JsonResponse(model_to_dict(score_data),safe=False,status=201)
            score_data.score=score
            score_data.save()
            return JsonResponse(model_to_dict(score_data),safe=False,status=200)
        if request.method == 'DELETE':
            try:
                course=Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return HttpResponseNotFound()
            try:
                score_data=CoursePref.objects.get(user=request.user,course=course)
            except CoursePref.DoesNotExist:
                return HttpResponseNotFound()
            score_data.delete()
            return HttpResponse(status=200)
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
    return HttpResponse(status=401)
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
    score_sum={}
    user_count={}
    score_average={}
    relation={}
    all_course=[course for course in Course.objects.all()]
    score_result=[]
    for course in all_course:
        score_sum[course.id]=0.0
        user_count[course.id]=0.0
        for score_data in CoursePref.objects.filter(course=course):
            user_count[course.id]=user_count[course.id]+1.0
            score_sum[course.id]=score_sum[course.id]+score_data.score
        score_average[course.id]=(score_sum[course.id]-5.0*user_count[course.id])/(user_count[course.id]+division_error)+5.0
    for person in User.objects.all():
        user_sum=0.0
        person_sum=0.0
        user_person_sum=0.0
        for user_score_data in CoursePref.objects.filter(user=user):
            try:
                person_score_data=CoursePref.objects.get(user=person, course=user_score_data.course)
                course=user_score_data.course
                user_delta=user_score_data.score-score_average[course.id]
                person_delta=person_score_data.score-score_average[course.id]
                user_sum=user_sum+user_delta*user_delta
                person_sum=person_sum+person_delta*person_delta
                user_person_sum=user_person_sum+user_delta*person_delta
            except CoursePref.DoesNotExist:
                continue
        relation[person.id]=user_person_sum/(math.sqrt(user_sum*person_sum)+division_error)
    for course in all_course:
        try:
            score_result.append({'course':course.id,'score':CoursePref.objects.get(user=user,course=course).score})
        except CoursePref.DoesNotExist:
            score_sum=0.0
            relation_sum=0.0
            for score_data in CoursePref.objects.filter(course=course):
                relation_sum=relation_sum+relation[score_data.user.id]
                score_sum=score_sum+score_data.score*relation[score_data.user.id]
            score_result.append({'course':course.id,'score':(score_sum-5.0*relation_sum)/(relation_sum+division_error)+5.0})
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
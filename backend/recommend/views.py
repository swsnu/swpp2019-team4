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
    all_course = [course for course in Course.objects.all().values()]
    all_coursepref = [score_data for score_data in CoursePref.objects.all().values()]
    user_coursepref = [score_data for score_data in CoursePref.objects.filter(user=user).values()]
    all_user = [person for person in User.objects.all().values()]
    user_dict = model_to_dict(user)

    score_sum = {}
    user_count = {}
    score_average = {}

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
    score_result = []

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
        user_score_square_sum[score_data['user_id']] += score_data['score']*score_data['score']
        user_score_count[score_data['user_id']] += 1.0

    for course in all_course:
        if user_count[course['id']] == 0.0:
            score_average[course['id']] = 5.0
        else:
            score_average[course['id']] = score_sum[course['id']]/user_count[course['id']]

    for person in all_user:
        if user_score_count[person['id']] == 0.0:
            user_average[person['id']] = 5.0
            user_std[person['id']] = 0.0
        else:
            user_average[person['id']] = user_score_sum[person['id']]/user_score_count[person['id']]
            user_std[person['id']] = math.sqrt(user_score_square_sum[person['id']]/user_score_count[person['id']]-user_average[person['id']]*user_average[person['id']])

    for score_data in user_coursepref:
        score_result_dict[score_data['course_id']] = score_data['score']

    for score_data in all_coursepref:
        course = score_data['course_id']
        score = score_result_dict[course]
        person = score_data['user_id']
        if score > -1.0:
            user_delta = score-score_average[course]
            person_delta = score_data['score']-score_average[course]
            user_sum[person] += user_delta*user_delta
            person_sum[person] += person_delta*person_delta
            user_person_sum[person] += user_delta*person_delta

    for person in all_user:
        if user_sum[person['id']]*person_sum[person['id']] == 0.0:
            relation[person['id']] = 0.0
            if person['department'] == user_dict['department']:
                relation[person['id']] += 1.0/1024.0
            if person['grade'] == user_dict['grade']:
                relation[person['id']] += 1.0/1048576.0
        else:
            relation[person['id']] = user_person_sum[person['id']]/math.sqrt(user_sum[person['id']]*person_sum[person['id']])

    for score_data in all_coursepref:
        if user_std[score_data['user_id']] != 0.0:
            score_weighted_sum[score_data['course_id']] += relation[score_data['user_id']]*(score_data['score']-user_average[score_data['user_id']])/user_std[score_data['user_id']]
        relation_sum[score_data['course_id']] += abs(relation[score_data['user_id']])

    for course in all_course:
        if score_result_dict[course['id']] < -1.0:
            if relation_sum[course['id']] == 0.0:
                score_result_dict[course['id']] = score_average[course['id']]
            else:
                score_result_dict[course['id']] = round(score_weighted_sum[course['id']]*user_std[user_dict['id']]/relation_sum[course['id']]+user_average[user_dict['id']],3)
        if score_result_dict[course['id']] < 0.0:
            score_result_dict[course['id']] = 0.0
        if score_result_dict[course['id']] > 10.0:
            score_result_dict[course['id']] = 10.0

    for course in all_course:
        score_result.append({'course':course['id'], 'score':score_result_dict[course['id']]})

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
                return JsonResponse(model_to_dict(new_score),safe=False,status=201)
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
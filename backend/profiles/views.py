from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Student Career App API!")

@api_view(["GET"])
def profile_detail(request, username):
    try:
        profile = Profile.objects.get(username=username)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    serializer = ProfileSerializer(profile)
    return Response(serializer.data)
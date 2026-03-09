from rest_framework import serializers
from .models import Profile, Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    saved_jobs = JobSerializer(many=True, read_only=True)
    applied_jobs = JobSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            "full_name", "email", "phone", "location", "title", "bio",
            "github", "linkedin", "portfolio",
            "dark_mode", "saved_jobs", "applied_jobs",
            "skills", "education", "experience", "projects",
            "certifications", "languages", "resumes", "cover_letters"
        ]
from django.contrib import admin
from .models import Profile, Job, Education, Experience, Project, Resume, CoverLetter

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "title", "location")
    search_fields = ("full_name", "email", "title")
    filter_horizontal = ("saved_jobs", "applied_jobs", "education", "experience", "projects", "resumes", "cover_letters")

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "created_at")
    search_fields = ("title", "company")
    list_filter = ("created_at", "location")

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("school", "degree", "field", "start_date", "end_date")
    search_fields = ("school", "degree", "field")

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("company", "position", "location", "start_date", "end_date", "current")
    search_fields = ("company", "position", "location")
    list_filter = ("current",)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title",)
    search_fields = ("title",)

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "created_at")
    list_filter = ("type",)

@admin.register(CoverLetter)
class CoverLetterAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
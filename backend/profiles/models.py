from django.db import models

# Jobs model
class Job(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

# Education
class Education(models.Model):
    school = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    gpa = models.CharField(max_length=10, blank=True, null=True)
    activities = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.degree} at {self.school}"

# Experience
class Experience(models.Model):
    company = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    current = models.BooleanField(default=False)
    description = models.TextField()

    def __str__(self):
        return f"{self.position} at {self.company}"

# Projects
class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.JSONField(default=list)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

# Resumes
class Resume(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=[("created","Created"), ("uploaded","Uploaded")])
    file_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Cover Letters
class CoverLetter(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Profile
class Profile(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    portfolio = models.URLField(blank=True, null=True)

    # Dark mode preference
    dark_mode = models.BooleanField(default=False)

    # Many-to-many relations
    saved_jobs = models.ManyToManyField(Job, blank=True, related_name="saved_by")
    applied_jobs = models.ManyToManyField(Job, blank=True, related_name="applied_by")
    education = models.ManyToManyField(Education, blank=True)
    experience = models.ManyToManyField(Experience, blank=True)
    projects = models.ManyToManyField(Project, blank=True)
    skills = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)
    resumes = models.ManyToManyField(Resume, blank=True)
    cover_letters = models.ManyToManyField(CoverLetter, blank=True)

    def __str__(self):
        return self.full_name
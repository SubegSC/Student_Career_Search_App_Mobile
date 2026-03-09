Please expand the current project by implementing a **complete User Profile system with a backend built using Django and a MySQL database**. The platform should function as a **professional profile, resume builder, and job application toolkit**.

### 1. Frontend

Create a modern, responsive UI with **dark mode support**.

Include a **User Profile Dashboard** where users can manage their professional information.

Profile fields should include:

Basic Information:

* Full name
* Email
* Phone number
* Location
* Professional title
* Bio / summary

Professional Links:

* GitHub profile
* LinkedIn profile
* Portfolio website
* Additional optional links

### 2. Resume Builder

Implement a resume management system.

Features:

* Create resumes within the platform
* Upload existing resumes (PDF/DOCX)
* Edit resumes
* Resume preview
* Download resumes
* Multiple resumes per user

Resume sections:

* Education
* Work experience
* Skills
* Certifications
* Projects
* Achievements
* Languages
* Volunteer experience

Each section should allow **multiple entries**.

### 3. Cover Letter System

Users should be able to:

* Create cover letters
* Edit cover letters
* Save multiple cover letters
* Generate cover letters from job descriptions
* Download cover letters

### 4. Portfolio Section

Allow users to add portfolio projects with:

* Project title
* Description
* GitHub link
* Live project link
* Images or screenshots
* Technologies used

Users must be able to add, edit, and delete projects.

### 5. File Upload System

Support file uploads for:

* Resume files
* Portfolio images
* Documents

Implement file validation and size limits.

### 6. Backend (Django)

Use **Django with Django REST Framework** to create a REST API.

The backend should handle:

* Authentication
* User profiles
* Resume CRUD operations
* Cover letter CRUD operations
* Portfolio CRUD operations
* File uploads

Example API routes:

* POST /api/auth/register
* POST /api/auth/login
* GET /api/profile
* PUT /api/profile
* POST /api/resumes
* GET /api/resumes
* PUT /api/resumes/:id
* DELETE /api/resumes/:id

### 7. Database

Use **MySQL** as the primary database.

Design relational tables for:

* users
* profiles
* resumes
* education
* experience
* skills
* projects
* certifications
* cover_letters
* portfolio_items
* uploaded_files

Use proper foreign keys and indexing.

### 8. Optional Fields

Most profile fields should be **optional (nullable)** so users can complete their profiles gradually.

Only require:

* name
* email
* password

All other fields should allow null values.

### 9. Profile Completion Indicator

Add a **profile completion progress bar** that encourages users to complete missing sections.

Example:

* Basic Info ✔
* Resume ✔
* Skills ✔
* Portfolio ☐
* GitHub ☐

### 10. Security

Implement proper security practices:

* Password hashing
* JWT or token authentication
* Input validation
* Secure file uploads
* Rate limiting
* Protected API routes

### 11. General Requirements

* Clean architecture
* Modular Django apps
* RESTful API design
* Responsive UI
* Dark mode support
* Scalable structure

The final result should be a **full professional profile platform where users can manage resumes, portfolios, and job application materials in one place**.

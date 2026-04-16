# Student Career Search App

A high-fidelity mobile career platform prototype built for **CPSC 481: Human-Computer Interaction I**. This project was designed as part of a design portfolio exploring how **human-computer interaction principles**, **front-end interface design**, and **interactive workflows** can improve the student internship and job search experience.

The system centralizes several parts of the student career-search process into one interface, including:

- browsing and filtering jobs
- saving and comparing opportunities
- viewing job details
- applying to jobs
- tracking submitted applications
- managing profile information
- browsing and booking career advisors
- viewing career events and workshops

This final implementation was built as a **high-fidelity interactive prototype** using **React + TypeScript (TSX)**. It evolved from an earlier **medium-fidelity design stage created in Figma**, which is available here:

**Earlier medium-fidelity prototype:**  
https://riff-theme-81329472.figma.site

---

## Project Overview

The Student Career Search App was created to address a common usability problem in university career services: students often have to rely on multiple disconnected systems for job searching, application tracking, advising, and career support resources.

This project applies **HCI and interface design principles** to reduce that fragmentation and create a more unified, lower-stress experience for students. The design focuses on:

- reducing cognitive load
- improving visibility of system status
- supporting efficient navigation
- making important actions clear and easy to access
- helping users compare options and make informed decisions
- integrating support resources such as advisors and workshops directly into the workflow

From an HCI perspective, the app emphasizes ideas such as:

- **clear information hierarchy**
- **progressive disclosure**
- **consistency across screens**
- **user control and freedom**
- **feedback and visibility of status**
- **workflow-oriented mobile design**

---

## Main Features

### Student workflow features
- **Home dashboard** with application summary, recommended jobs, deadlines, booked advisors, and registered workshops
- **Browse Jobs** screen with job cards, relevance sorting, and filters
- **Job Details** page with compensation, deadlines, company details, and quick apply
- **Saved Jobs** list for shortlisting opportunities
- **Compare Jobs** view for side-by-side decision making
- **Applications** screen for tracking submitted jobs and application states
- **Profile** overview with completion progress
- **Edit Profile** form with personal and professional information
- **Resume** section
- **Portfolio** section

### Career support features
- **Advisor browsing** and **appointment booking**
- **Events and workshops** browsing and registration
- integrated career support content directly within the app experience

---

## Tech Stack

### Frontend
- **React**
- **TypeScript (TSX)**
- **Vite**
- **CSS / Tailwind-related styling files**
- reusable UI component structure

### Project / Prototype focus
This project is primarily focused on the **user interface**, **interaction design**, and **prototype workflow demonstration** rather than backend production deployment. The main goal is to demonstrate how a real student-facing system could behave through a functional high-fidelity prototype.

---

## Why this project matters

This project is especially relevant to **human-computer interaction**, **front-end development**, and **UX/UI design** because it combines:

- user-centered problem framing
- interface iteration from low-fidelity to high-fidelity
- heuristic evaluation and design refinement
- interactive front-end implementation
- real workflow simulation for a meaningful student use case

It demonstrates how design decisions can directly improve usability in systems where users may already be under pressure, such as during internship recruiting, application deadlines, and advising preparation.

---

## Design Background

This final app was developed as the last stage of an iterative HCI design process:

1. **Low-fidelity paper sketches**
2. **Walkthroughs and task analysis**
3. **Medium-fidelity Figma prototype**
4. **Heuristic evaluation**
5. **High-fidelity TypeScript implementation**

The final version translates earlier design ideas into a more realistic interactive prototype that better demonstrates user flows, navigation, and system behavior.

---

## Running the Project

Use the project root directory that contains `package.json`.

### 1. Install dependencies
```bash
npm i
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Open the local development URL
After starting the server, open the local URL shown in the terminal, usually something like:

```bash
http://localhost:5173/
```

---

## Repository Structure

```text
.
├── README.md
├── docs/
│   ├── portfolio/
│   │   ├── Portfolio_II.pdf
│   │   └── Portfolio_II_Instructions.pdf
│   └── media/
│       └── Final_Video_Demonstration.mp4
├── ATTRIBUTIONS.md
├── index.html
├── models.py
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── serializers.py
├── settings.py
├── urls.py
├── views.py
├── vite.config.ts
├── backend/
│   ├── db.sqlite3
│   ├── manage.py
│   ├── backend/
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── __init__.py
│   └── profiles/
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── tests.py
│       ├── views.py
│       ├── __init__.py
│       └── migrations/
│           └── __init__.py
├── guidelines/
│   └── Guidelines.md
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── routes.tsx
    │   ├── components/
    │   │   ├── Layout.tsx
    │   │   ├── figma/
    │   │   │   └── ImageWithFallback.tsx
    │   │   └── ui/
    │   │       ├── accordion.tsx
    │   │       ├── alert-dialog.tsx
    │   │       ├── alert.tsx
    │   │       ├── aspect-ratio.tsx
    │   │       ├── avatar.tsx
    │   │       ├── badge.tsx
    │   │       ├── breadcrumb.tsx
    │   │       ├── button.tsx
    │   │       ├── calendar.tsx
    │   │       ├── card.tsx
    │   │       ├── carousel.tsx
    │   │       ├── chart.tsx
    │   │       ├── checkbox.tsx
    │   │       ├── collapsible.tsx
    │   │       ├── command.tsx
    │   │       ├── context-menu.tsx
    │   │       ├── dialog.tsx
    │   │       ├── drawer.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       ├── form.tsx
    │   │       ├── hover-card.tsx
    │   │       ├── input-otp.tsx
    │   │       ├── input.tsx
    │   │       ├── label.tsx
    │   │       ├── menubar.tsx
    │   │       ├── navigation-menu.tsx
    │   │       ├── pagination.tsx
    │   │       ├── popover.tsx
    │   │       ├── progress.tsx
    │   │       ├── radio-group.tsx
    │   │       ├── resizable.tsx
    │   │       ├── scroll-area.tsx
    │   │       ├── select.tsx
    │   │       ├── separator.tsx
    │   │       ├── sheet.tsx
    │   │       ├── sidebar.tsx
    │   │       ├── skeleton.tsx
    │   │       ├── slider.tsx
    │   │       ├── sonner.tsx
    │   │       ├── switch.tsx
    │   │       ├── table.tsx
    │   │       ├── tabs.tsx
    │   │       ├── textarea.tsx
    │   │       ├── toggle-group.tsx
    │   │       ├── toggle.tsx
    │   │       ├── tooltip.tsx
    │   │       ├── use-mobile.ts
    │   │       └── utils.ts
    │   ├── context/
    │   │   ├── AppContext.tsx
    │   │   └── ProfileContext.tsx
    │   ├── data/
    │   │   └── jobsDatabase.ts
    │   └── pages/
    │       ├── Alerts.tsx
    │       ├── Browse.tsx
    │       ├── CompareJobs.tsx
    │       ├── EditProfile.tsx
    │       ├── Home.tsx
    │       ├── JobDetail.tsx
    │       ├── MyApplications.tsx
    │       ├── Profile.tsx
    │       └── SavedJobs.tsx
    ├── imports/
    │   └── professional-profile-platform.md
    └── styles/
        ├── fonts.css
        ├── index.css
        ├── tailwind.css
        └── theme.css
```

---

## Included Documentation

The repository also includes supporting project deliverables in the `docs/` folder:

### `docs/portfolio/`
- **Portfolio_II.pdf** — final HCI design portfolio documenting the full design process, rationale, heuristic evaluation, and fidelity progression
- **Portfolio_II_Instructions.pdf** — exact walkthrough and usage instructions for demonstrating the final prototype

### `docs/media/`
- **Final_Video_Demonstration.mp4** — video walkthrough of the final prototype, covering the major user flows and implemented functionality

These files document the evolution from earlier interface concepts to the final high-fidelity interactive implementation.

---

## Important Frontend Files

### App entry and routing
- `src/main.tsx` – application entry point
- `src/app/App.tsx` – root app component
- `src/app/routes.tsx` – routing and screen navigation

### Main pages
- `Home.tsx` – dashboard and overview
- `Browse.tsx` – job search and filtering
- `JobDetail.tsx` – detailed job information
- `SavedJobs.tsx` – saved job listings
- `CompareJobs.tsx` – comparison interface
- `MyApplications.tsx` – application tracking
- `Profile.tsx` – user profile overview
- `EditProfile.tsx` – editable profile screen

### Shared structure
- `Layout.tsx` – layout wrapper and shared structure
- `AppContext.tsx` / `ProfileContext.tsx` – shared state and profile-related logic
- `jobsDatabase.ts` – mock job data used for prototyping and interface flows

### Styling
- `index.css`, `tailwind.css`, `theme.css`, `fonts.css` – visual styling and theme configuration

---

## Notes

- This repository represents a **prototype / design implementation**, not a production-ready deployed platform.
- Some data and flows are simulated for demonstration purposes.
- The project emphasizes **user-facing interaction**, **screen design**, and **workflow clarity** over production backend depth.
- Empty states in some screens are intentional and part of the designed user experience.

---

## Learning / Resume Relevance

This project demonstrates experience in:

- **Human-Computer Interaction (HCI)**
- **Front-end interface design**
- **React + TypeScript development**
- **mobile-first UI design**
- **interactive prototyping**
- **design iteration and refinement**
- **heuristic evaluation**
- **user-centered design thinking**
- **workflow design for real users**

It is especially relevant to roles involving:
- front-end software development
- UX engineering
- product design / prototyping
- HCI-focused development
- internship or early-career product engineering work

---

## Author / Team Context

This project was developed as part of a group design portfolio for **CPSC 481: Human-Computer Interaction I** at the **University of Calgary**.


  # Student Career App

  This is a code bundle for the Final High-fidelity Student Career App. This is based on the older Medium-fidelity prototype, which is available at https://riff-theme-81329472.figma.site.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  


C:.
│   ATTRIBUTIONS.md
│   index.html
│   models.py
│   package-lock.json
│   package.json
│   postcss.config.mjs
│   README.md
│   serializers.py
│   settings.py
│   urls.py
│   views.py
│   vite.config.ts
│
├───backend
│   │   db.sqlite3
│   │   manage.py
│   │
│   ├───backend
│   │   │   asgi.py
│   │   │   settings.py
│   │   │   urls.py
│   │   │   wsgi.py
│   │   │   __init__.py
│   │   │
│   │   └───__pycache__
│   │           settings.cpython-313.pyc
│   │           urls.cpython-313.pyc
│   │           wsgi.cpython-313.pyc
│   │           __init__.cpython-313.pyc
│   │
│   └───profiles
│       │   admin.py
│       │   apps.py
│       │   models.py
│       │   tests.py
│       │   views.py
│       │   __init__.py
│       │
│       └───migrations
│               __init__.py
│
├───guidelines
│       Guidelines.md
│
└───src
    │   main.tsx
    │
    ├───app
    │   │   App.tsx
    │   │   routes.tsx
    │   │
    │   ├───components
    │   │   │   Layout.tsx
    │   │   │
    │   │   ├───figma
    │   │   │       ImageWithFallback.tsx
    │   │   │
    │   │   └───ui
    │   │           accordion.tsx
    │   │           alert-dialog.tsx
    │   │           alert.tsx
    │   │           aspect-ratio.tsx
    │   │           avatar.tsx
    │   │           badge.tsx
    │   │           breadcrumb.tsx
    │   │           button.tsx
    │   │           calendar.tsx
    │   │           card.tsx
    │   │           carousel.tsx
    │   │           chart.tsx
    │   │           checkbox.tsx
    │   │           collapsible.tsx
    │   │           command.tsx
    │   │           context-menu.tsx
    │   │           dialog.tsx
    │   │           drawer.tsx
    │   │           dropdown-menu.tsx
    │   │           form.tsx
    │   │           hover-card.tsx
    │   │           input-otp.tsx
    │   │           input.tsx
    │   │           label.tsx
    │   │           menubar.tsx
    │   │           navigation-menu.tsx
    │   │           pagination.tsx
    │   │           popover.tsx
    │   │           progress.tsx
    │   │           radio-group.tsx
    │   │           resizable.tsx
    │   │           scroll-area.tsx
    │   │           select.tsx
    │   │           separator.tsx
    │   │           sheet.tsx
    │   │           sidebar.tsx
    │   │           skeleton.tsx
    │   │           slider.tsx
    │   │           sonner.tsx
    │   │           switch.tsx
    │   │           table.tsx
    │   │           tabs.tsx
    │   │           textarea.tsx
    │   │           toggle-group.tsx
    │   │           toggle.tsx
    │   │           tooltip.tsx
    │   │           use-mobile.ts
    │   │           utils.ts
    │   │
    │   ├───context
    │   │       AppContext.tsx
    │   │       ProfileContext.tsx
    │   │
    │   ├───data
    │   │       jobsDatabase.ts
    │   │
    │   └───pages
    │           Alerts.tsx
    │           Browse.tsx
    │           CompareJobs.tsx
    │           EditProfile.tsx
    │           Home.tsx
    │           JobDetail.tsx
    │           MyApplications.tsx
    │           Profile.tsx
    │           SavedJobs.tsx
    │
    ├───imports
    │       professional-profile-platform.md
    │
    └───styles
            fonts.css
            index.css
            tailwind.css
            theme.css

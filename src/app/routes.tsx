import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SavedJobs } from './pages/SavedJobs';
import { MyApplications } from './pages/MyApplications';
import { Alerts } from './pages/Alerts';
import { Browse } from './pages/Browse';
import { JobDetail } from './pages/JobDetail';
import { CompareJobs } from './pages/CompareJobs';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'browse',       Component: Browse        },
      { path: 'saved',        Component: SavedJobs     },
      { path: 'applications', Component: MyApplications},
      { path: 'alerts',       Component: Alerts        },

      { path: 'job/:jobId', Component: JobDetail   },
      { path: 'compare',    Component: CompareJobs  },

      // ── Profile ─────────────────────────────────────────────────────────
      { path: 'profile',      Component: Profile     },
      { path: 'profile/edit', Component: EditProfile },

      // Education
      { path: 'profile/edit-education',     Component: EditProfile },
      { path: 'profile/edit-education/:id', Component: EditProfile },

      // Experience
      { path: 'profile/edit-experience',     Component: EditProfile },
      { path: 'profile/edit-experience/:id', Component: EditProfile },

      // Skills
      { path: 'profile/edit-skills', Component: EditProfile },

      // Resume — create new or edit existing
      { path: 'profile/create-resume',  Component: EditProfile },
      { path: 'profile/resume/:id',     Component: EditProfile },

      // Portfolio — add new or edit existing
      { path: 'profile/add-project',    Component: EditProfile },
      { path: 'profile/project/:id',    Component: EditProfile },

      // Cover Letter — create new or edit existing
      { path: 'profile/create-cover-letter', Component: EditProfile },
      { path: 'profile/cover-letter/:id',    Component: EditProfile },
    ],
  },
]);
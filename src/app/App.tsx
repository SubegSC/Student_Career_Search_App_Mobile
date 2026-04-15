import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { ProfileProvider } from './context/ProfileContext';

export default function App() {
  return (
    <ProfileProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ProfileProvider>
  );
}
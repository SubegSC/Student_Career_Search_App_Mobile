import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { ProfileProvider } from './context/ProfileContext';
import { PhoneFrame } from './components/PhoneFrame';

export default function App() {
  return (
    <ProfileProvider>
      <AppProvider>
        <PhoneFrame>
          <RouterProvider router={router} />
        </PhoneFrame>
      </AppProvider>
    </ProfileProvider>
  );
}
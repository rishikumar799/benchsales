import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { PlatformAdminProvider } from './context/PlatformAdminContext';
import { RecruiterProvider } from './context/RecruiterContext';
import { JobSeekerProvider } from './context/JobSeekerContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlatformAdminProvider>
          <RecruiterProvider>
            <JobSeekerProvider>
              <App />
            </JobSeekerProvider>
          </RecruiterProvider>
        </PlatformAdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);


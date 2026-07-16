import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { RecruiterProvider } from './context/RecruiterContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RecruiterProvider>
          <App />
        </RecruiterProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);


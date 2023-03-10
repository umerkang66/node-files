import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import ConfirmPassword from './components/auth/confirm-password';
import EmailVerification from './components/auth/email-verification';
import ForgetPassword from './components/auth/forgot-password';
import { Signin } from './components/auth/signin';
import { Signup } from './components/auth/signup';
import { RootLayout } from './components/layout/root-layout';
import { ErrorPage } from './pages/error-page';
import { Home } from './pages/home';

export function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />

        <Route path="auth/signin" element={<Signin />} />
        <Route path="auth/signup" element={<Signup />} />
        <Route path="auth/verification" element={<EmailVerification />} />
        <Route path="auth/forget-password" element={<ForgetPassword />} />
        <Route path="auth/confirm-password" element={<ConfirmPassword />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

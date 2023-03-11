import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
// Routes
import { ResetPassword } from './components/auth/reset-password';
import { EmailVerification } from './components/auth/email-verification';
import { ForgetPassword } from './components/auth/forget-password';
import { Signin } from './components/auth/signin';
import { Signup } from './components/auth/signup';
import { RootLayout } from './components/layout/root-layout';
import { ErrorPage } from './pages/error-page';
import { Home } from './pages/home';
// Contexts
import { ThemeContextProvider } from './context/theme-provider';

export function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />

        <Route path="auth/signin" element={<Signin />} />
        <Route path="auth/signup" element={<Signup />} />
        <Route path="auth/verification" element={<EmailVerification />} />
        <Route path="auth/forget-password" element={<ForgetPassword />} />
        <Route path="auth/reset-password" element={<ResetPassword />} />
      </Route>
    )
  );

  return (
    <ThemeContextProvider>
      <RouterProvider router={router} />
    </ThemeContextProvider>
  );
}

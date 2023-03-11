import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

// Routes
import { ResetPassword } from './components/auth/reset-password';
import { ConfirmSignup } from './components/auth/confirm-signup';
import { ForgetPassword } from './components/auth/forget-password';
import { Signin } from './components/auth/signin';
import { Signup } from './components/auth/signup';
import { RootLayout } from './components/layout/root-layout';
import { ErrorPage } from './pages/error-page';
import { Home } from './pages/home';
// Contexts
import { ThemeContextProvider } from './context/theme-provider';
import { Toaster } from 'react-hot-toast';

export function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />

        <Route path="auth/signin" element={<Signin />} />
        <Route path="auth/signup" element={<Signup />} />
        <Route path="auth/confirm-signup" element={<ConfirmSignup />} />
        <Route path="auth/forget-password" element={<ForgetPassword />} />
        <Route path="auth/reset-password" element={<ResetPassword />} />
      </Route>
    )
  );

  return (
    <ThemeContextProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 4000, style: { backgroundColor: '#eeebff' } }}
      />
    </ThemeContextProvider>
  );
}

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
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

export function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<RootLayout />}
        errorElement={<ErrorPage />}
      >
        <Route index element={<Home />} />
        <Route path="auth">
          {/* if the above route has element, it will act as layout */}
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="confirm-signup"
            element={<ConfirmSignup />}
          />
          <Route
            path="forget-password"
            element={<ForgetPassword />}
          />
          <Route
            path="reset-password"
            element={<ResetPassword />}
          />
        </Route>
      </Route>
    )
  );

  return (
    <ThemeContextProvider>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={3000}
        theme="dark"
        position="bottom-right"
        toastStyle={{ backgroundColor: '#4f4242' }}
      />
    </ThemeContextProvider>
  );
}
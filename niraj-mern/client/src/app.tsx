import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SWRConfig } from 'swr';

// Components
import { ResetPassword } from './components/auth/reset-password';
import { ConfirmSignup } from './components/auth/confirm-signup';
import { ForgotPassword } from './components/auth/forgot-password';
import { Signin } from './components/auth/signin';
import { Signup } from './components/auth/signup';
import { RootLayout } from './components/layout/root-layout';
// Pages
import { ErrorPage } from './pages/error-page';
import { Home } from './pages/home';
// Contexts
import { ContextProviders } from './context-providers';
import { type Errors } from './types';

export function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="auth">
          {/* if the above route has element, it will act as layout */}
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="confirm-signup" element={<ConfirmSignup />} />
          <Route path="forget-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Route>
    )
  );

  return (
    <ContextProviders>
      <SWRConfig
        value={{
          onError(err, key, config) {
            if (err instanceof Array) {
              const customError = err as Errors;
              customError.forEach(err => {
                const message = `${err.field ? `Field:${err.field} -- ` : ''}${
                  err.message
                }`;
                toast.error(message);
              });
            } else {
              console.error(err);
              toast.error('Something went wrong');
            }
          },
        }}
      >
        <RouterProvider router={router} />
        <ToastContainer
          autoClose={3000}
          theme="dark"
          position="bottom-right"
          toastStyle={{ backgroundColor: '#4f4242' }}
          transition={Slide}
        />
      </SWRConfig>
    </ContextProviders>
  );
}

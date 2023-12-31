import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';
import SigninForm from './components/SigninForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/signin" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

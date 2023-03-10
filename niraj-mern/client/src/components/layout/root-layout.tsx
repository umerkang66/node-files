import { Outlet } from 'react-router-dom';
import { Navbar } from '../user/navbar';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export { RootLayout };

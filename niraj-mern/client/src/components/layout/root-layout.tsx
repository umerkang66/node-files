import { Outlet } from 'react-router-dom';
import { Navbar } from '../navbar';

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export { RootLayout };

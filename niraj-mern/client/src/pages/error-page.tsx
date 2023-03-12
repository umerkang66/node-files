import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { CustomLink } from '../components/common/custom-link';
import { Navbar } from '../components/navbar';

const ErrorPage: FC = () => {
  const error = useRouteError() as any;

  return (
    <>
      <Navbar />
      <main id="error">
        <div id="error-content">
          <h1>Page not found</h1>
          <p>{error.data.replace('Error: ', '')}</p>
          <div className="button">
            <CustomLink to="/">HomePage</CustomLink>
          </div>
        </div>
      </main>
    </>
  );
};

export { ErrorPage };

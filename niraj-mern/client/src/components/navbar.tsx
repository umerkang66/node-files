import type { FC } from 'react';
import { BsFillSunFill } from 'react-icons/bs';

import { useThemeContext } from '../context/theme-provider';
import { useCurrentUser } from '../hooks/auth';
import { Container } from './common/container';
import { CustomLink } from './common/custom-link';

const Navbar: FC = () => {
  const theme = useThemeContext();
  const { data, loading } = useCurrentUser();

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <CustomLink to="/">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </CustomLink>

          <ul className="flex items-center space-x-4">
            <li>
              <button
                onClick={theme.toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded"
              >
                <BsFillSunFill className="text-secondary" size={24} />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
                placeholder="search..."
              />
            </li>
            <li className="text-white font-semibold text-lg">
              {!loading && (!data || !data.currentUser) && (
                <CustomLink to="/auth/signin">Sign in</CustomLink>
              )}
              {!loading && data && data.currentUser && (
                <>
                  {data.currentUser.name}
                  <button className="ml-2 rounded bg-red-500 py-1 px-4">
                    Sign Out
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export { Navbar };

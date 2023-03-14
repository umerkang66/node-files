import { FC, useEffect } from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useThemeContext } from '../context/theme-provider';

import { useUser } from '../hooks/auth/use-user';
import { useSignout } from '../hooks/auth/use-signout';
import { Container } from './common/container';
import { CustomLink } from './common/custom-link';
import { Spinner } from './common/spinner';

const Navbar: FC = () => {
  const theme = useThemeContext();
  const user = useUser();
  const signoutHook = useSignout();
  const navigate = useNavigate();

  useEffect(() => {
    if (signoutHook.data) {
      toast.success(signoutHook.data.message);
    }
    if (signoutHook.error) {
      signoutHook.error.forEach(err =>
        toast.error(err.message)
      );
    }
  }, [signoutHook.data, signoutHook.error]);

  const signoutHandler = () => {
    signoutHook.signout().then(() => navigate('/'));
  };

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <CustomLink to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10"
            />
          </CustomLink>

          <ul className="flex items-center space-x-4">
            <li>
              <button
                onClick={theme.toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded"
              >
                <BsFillSunFill
                  className="text-secondary"
                  size={24}
                />
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
              {!user.isLoading &&
                (!user.data || !user.data.currentUser) && (
                  <CustomLink to="/auth/signin">
                    Sign in
                  </CustomLink>
                )}
              {!user.isLoading &&
                user.data &&
                user.data.currentUser && (
                  <div className="flex justify-center items-center">
                    {user.data.currentUser.name}
                    <button
                      onClick={signoutHandler}
                      className="ml-2 rounded bg-red-500 py-1 px-4 flex justify-center items-center"
                      disabled={signoutHook.isLoading}
                    >
                      {signoutHook.isLoading ? (
                        <>
                          Sign Out <Spinner />
                        </>
                      ) : (
                        'Sign Out'
                      )}
                    </button>
                  </div>
                )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export { Navbar };

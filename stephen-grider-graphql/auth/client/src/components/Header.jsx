import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { currentUserQuery } from '../queries';
import { logoutMutation } from '../mutations';
import { useState } from 'react';

const Header = () => {
  const { data, loading } = useQuery(currentUserQuery);

  const [logout, { loading: logoutLoading }] = useMutation(logoutMutation);

  const logoutHandler = () => {
    logout({ refetchQueries: [{ query: currentUserQuery }] });
  };

  const renderButtons = () => {
    if (loading) {
      return null;
    }

    const { currentUser } = data;
    if (currentUser) {
      // authenticated
      return (
        <li onClick={logoutHandler}>
          <a>{logoutLoading ? 'Logging out...' : 'Logout'}</a>
        </li>
      );
    }

    // unauthenticated
    return (
      <>
        <li>
          <Link to="/signin">Signin</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
      </>
    );
  };

  return (
    <nav>
      <div className="nav-wrapper container">
        <Link to="/">
          <h5>GraphQl Auth</h5>
        </Link>
        <ul>{renderButtons()}</ul>
      </div>
    </nav>
  );
};

export default Header;

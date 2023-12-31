import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUserQuery } from '../queries';

export const useAfterAuth = () => {
  const { data: currentUserData, loading } = useQuery(currentUserQuery);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUserData.currentUser) {
      navigate('/dashboard');
    }
  }, [currentUserData, loading]);
};

// first time page load, even currentUserData is undefined, after fetching and not logged in, currentUserData.currentUser is null
export const useRequireAuth = () => {
  const { data: currentUserData, loading } = useQuery(currentUserQuery);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUserData.currentUser) {
      navigate('/signin');
    }
  }, [currentUserData, loading]);

  return currentUserData;
};

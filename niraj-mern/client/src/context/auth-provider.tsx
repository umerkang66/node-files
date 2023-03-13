import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { CurrentUser } from '../types';

type AuthContextType = {
  currentUser: CurrentUser | null;
  updateUser: (user: AuthContextType['currentUser']) => void;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  updateUser: () => {},
});

function useAuthContext() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] =
    useState<AuthContextType['currentUser']>(null);

  const updateUser = (user: AuthContextType['currentUser']) => {
    setCurrentUser(user);
  };

  const value = {
    currentUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuthContext, AuthProvider };

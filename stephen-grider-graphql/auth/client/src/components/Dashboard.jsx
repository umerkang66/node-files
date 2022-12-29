import { useRequireAuth } from '../hooks';

const DashBoard = () => {
  // first time page load, even currentUserData is undefined, after fetching and not logged in, currentUserData.currentUser is null
  const currentUserData = useRequireAuth();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        flexDirection: 'column',
      }}
    >
      <h1>Dashboard</h1>
      <div>
        <h3>
          Hello:
          {currentUserData &&
            currentUserData.currentUser &&
            currentUserData.currentUser.email.split('@')[0]}
        </h3>
      </div>
    </div>
  );
};

export default DashBoard;

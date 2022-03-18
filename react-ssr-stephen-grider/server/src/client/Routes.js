// Pages
import App from './App';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import AdminsListPage from './pages/AdminsListPage';
import NotFoundPage from './pages/NotFound';

// Routing without JSX and react-router
const Routes = [
  {
    // If we didn't tie the path, it will always be displayed on the screen
    ...App,
    /* component: App.component */
    // Nest these routes inside of App component
    routes: [
      {
        // HomePage is an object with component as key, and Home component as value
        ...HomePage,
        path: '/',
        exact: true,
      },
      {
        // UsersListPage is an object with component as key, and UsersList component as value, also loadData as both key and value
        ...UsersListPage,
        path: '/users',
      },
      {
        ...AdminsListPage,
        path: '/admins',
      },
      {
        // If not a single route match, show this one
        ...NotFoundPage,
      },
    ],
  },
];

export default Routes;

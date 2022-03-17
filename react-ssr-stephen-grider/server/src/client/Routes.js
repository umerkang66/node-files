// Components
import Home from './components/Home';
import UsersList, { loadData } from './components/UsersList';

// Routing without JSX and react-router
const Routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    loadData,
    path: '/users',
    component: UsersList,
  },
];

export default Routes;

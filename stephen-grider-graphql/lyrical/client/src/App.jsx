import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import SongList from './components/SongList';
import SongCreate from './components/SongCreate';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<SongList />} />
        <Route path="/songs/new" element={<SongCreate />} />
      </>
    )
  );

  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import SongList from './components/SongList';
import SongCreate from './components/SongCreate';
import SongDetail from './components/SongDetail';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<SongList />} />
        <Route path="/songs/new" element={<SongCreate />} />
        <Route path="/songs/:songId" element={<SongDetail />} />
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

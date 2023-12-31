import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import { fetchSongsQuery } from '../queries';
import { deleteSongMutation } from '../mutations';
import Loader from './Loader';

const SongList = () => {
  const { data, loading } = useQuery(fetchSongsQuery);

  const [deleteSong, { loading: deleteLoading }] =
    useMutation(deleteSongMutation);

  if (loading) {
    return <Loader />;
  }

  if (loading) return null;

  const deleteSongHandler = id => {
    deleteSong({
      variables: { id },
      refetchQueries: [{ query: fetchSongsQuery }],
    });

    /* we can also do for re-fetching
      await deleteSong({ variables: { id } });
      // this comes from 'useQuery'
      refetch();
    */
  };

  const renderSongs = () => {
    return data.songs.map(({ id, title }) => {
      return (
        <li className="collection-item" key={id}>
          <Link to={`/songs/${id}`}>{title}</Link>

          <i className="material-icons" onClick={() => deleteSongHandler(id)}>
            {deleteLoading ? '...' : 'delete'}
          </i>
        </li>
      );
    });
  };

  return (
    <div>
      <h3>All Songs</h3>
      <ul className="collection">{renderSongs()}</ul>
      <Link className="btn-floating btn-large red right" to="/songs/new">
        <i className="material-icons">add</i>
      </Link>
    </div>
  );
};

export default SongList;

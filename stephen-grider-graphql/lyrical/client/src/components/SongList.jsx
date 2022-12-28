import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const SongList = () => {
  const { data, loading } = useQuery(getAllSongs);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderSongs = () => {
    return data.songs.map(song => (
      <li className="collection-item" key={song.id}>
        {song.title}
      </li>
    ));
  };

  return (
    <div>
      <ul className="collection">{renderSongs()}</ul>
      <Link className="btn-floating btn-large red right" to="/songs/new">
        <i className="material-icons">add</i>
      </Link>
    </div>
  );
};

const getAllSongs = gql`
  {
    songs {
      id
      title
    }
  }
`;

export default SongList;

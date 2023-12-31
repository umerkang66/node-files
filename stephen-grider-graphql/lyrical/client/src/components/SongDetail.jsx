import { useQuery } from '@apollo/client';
import { fetchSongQuery } from '../queries';
import { useParams, Link } from 'react-router-dom';

import Loader from './Loader';
import LyricCreate from './LyricCreate';
import LyricList from './LyricList';

const SongDetail = () => {
  const { songId } = useParams();

  const { data, loading } = useQuery(fetchSongQuery, {
    variables: { id: songId },
  });

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Link to="/">Back</Link>
      <h3>{data.song.title}</h3>
      <LyricList lyrics={data.song.lyrics} />
      <LyricCreate songId={songId} />
    </div>
  );
};

export default SongDetail;

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';

import { fetchSongsQuery } from '../queries';
import { createSongMutation } from '../mutations';

const SongCreate = () => {
  const navigate = useNavigate();

  const [songTitle, setSongTitle] = useState('');
  const [createSong, { loading }] = useMutation(createSongMutation);

  const createSongHandler = async e => {
    e.preventDefault();
    // this title is "$title"
    await createSong({
      variables: { title: songTitle },
      // after running this mutation, update these queries
      // if this need some variables, we can also pass that
      refetchQueries: [{ query: fetchSongsQuery }],
    });

    navigate('/');
  };

  return (
    <div>
      <Link to="/">Back</Link>
      <h3>Create a new Song</h3>
      <form onSubmit={createSongHandler}>
        <label>Song Title</label>
        <input
          value={songTitle}
          onChange={e => setSongTitle(e.target.value)}
          type="text"
        />
        <button style={{ width: '170px' }} className="btn" type="submit">
          {loading ? 'Creating...' : 'Create Song'}
        </button>
      </form>
    </div>
  );
};

export default SongCreate;

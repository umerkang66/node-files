import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { addLyricToSongMutation } from '../mutations';

const LyricCreate = ({ songId }) => {
  const [addLyricToSong, { loading }] = useMutation(addLyricToSongMutation);

  const [lyric, setLyric] = useState('');

  const lyricCreateHandler = async e => {
    e.preventDefault();

    // this mutation will respond with the "song" object (that has id), apollo will recognize that this "song" has been previously fetched (through that id), so it just updates that "song"
    await addLyricToSong({
      // here 'songId' is being expected as "songId"
      variables: { songId, content: lyric },
    });

    setLyric('');
  };

  return (
    <form onSubmit={lyricCreateHandler}>
      <label>Add a Lyric</label>
      <input
        type="text"
        value={lyric}
        onChange={e => setLyric(e.target.value)}
      />
      <button className="btn">
        {loading ? 'Creating...' : 'Create Lyric'}
      </button>
    </form>
  );
};

export default LyricCreate;

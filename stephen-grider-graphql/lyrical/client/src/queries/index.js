import { gql } from '@apollo/client';

export const fetchSongsQuery = gql`
  {
    songs {
      id
      title
    }
  }
`;

export const fetchSongQuery = gql`
  # 'fetchSong' is just the name of the query
  # provide id that has the type of "ID" '!' means it is required
  # if we didn't provide the required flag '!', query will be invalidate, because the server is expecting it
  query fetchSong($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {
        id
        content
        # here is a chance that likes already exists before
        likes
      }
    }
  }
`;

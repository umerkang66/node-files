import { gql } from '@apollo/client';

export const fetchSongs = gql`
  {
    songs {
      id
      title
    }
  }
`;

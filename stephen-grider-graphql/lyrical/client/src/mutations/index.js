import { gql } from '@apollo/client';

export const createSongMutation = gql`
  mutation AddSong($title: String!) {
    addSong(title: $title) {
      id
    }
  }
`;

export const deleteSongMutation = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id) {
      id
    }
  }
`;

export const addLyricToSongMutation = gql`
  mutation addLyricToSong($songId: ID!, $content: String!) {
    addLyricToSong(songId: $songId, content: $content) {
      # fetch the complete user except the title of user
      id
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

export const likeLyricMutation = gql`
  mutation likeLyric($id: ID) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

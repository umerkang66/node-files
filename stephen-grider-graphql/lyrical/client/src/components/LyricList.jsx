import { useMutation } from '@apollo/client';

import { likeLyricMutation } from '../mutations';

const LyricList = ({ lyrics }) => {
  const [likeLyric] = useMutation(likeLyricMutation);

  const onLikeHandler = (id, likes) => {
    likeLyric({
      variables: { id },
      // tell what the response should be
      optimisticResponse: {
        // we have to tell that this is the mutation
        __typename: 'Mutation',
        // to see how to duplicate the data, see the network request tab for graphql request
        likeLyric: {
          id,
          __typename: 'LyricType',
          likes: likes + 1,
        },
      },
    });
  };

  const renderLyrics = () => {
    return lyrics.map(({ id, content, likes }) => (
      <li key={id} className="collection-item">
        {content}
        <div className="collection-item__right">
          <div className="collection-item__likes">{likes}</div>

          <i
            onClick={() => onLikeHandler(id, likes)}
            className="material-icons"
          >
            thumb_up
          </i>
        </div>
      </li>
    ));
  };

  if (!lyrics.length) {
    return null;
  }

  return <ul className="collection">{renderLyrics()}</ul>;
};

export default LyricList;

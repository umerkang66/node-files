import React from 'react';

// This static context is being passed by renderer from StaticRouter context property
const NotFoundPage = ({ staticContext = {} }) => {
  staticContext.notFound = true;

  return (
    <div className="center-align" style={{ marginTop: '200px' }}>
      <h3>Oops, page not found</h3>
    </div>
  );
};

export default {
  component: NotFoundPage,
};

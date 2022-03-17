// These LIBRARIES will not be included in final bundle.js file, because we don't need it, in fact we need it in the client. We just need it here to create the string
// These functions will be included but not all the libraries
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

// Manually created routes
import Routes from '../client/Routes';

const renderer = (req, store) => {
  // Render the client code into string
  // Server will understand StaticRouter
  // The static router needs to know what the current "path" (req.path) is what component to show, BrowserRouter figure this out using the url in the browser
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={{}}>
        {/* Currently routes is an array of objects, so we have to render these using "renderRoutes" function provided by "react-router-config" library */}
        <div>{renderRoutes(Routes)}</div>
      </StaticRouter>
    </Provider>
  );

  // This "html" is for adding script tags
  // This bundle.js file will come from static folder "public" that we have specified in app middleware
  const rootHtml = `
    <html>
      <head></head>
      <body>
        <div id="root">${content}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `;

  return rootHtml;
};

export default renderer;

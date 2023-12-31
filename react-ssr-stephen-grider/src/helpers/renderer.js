// These LIBRARIES will not be included in final bundle.js file, because we don't need it, in fact we need it in the client. We just need it here to create the string
// These functions will be included but not all the libraries
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';
import { Helmet } from 'react-helmet';

// Manually created routes
import Routes from '../client/Routes';

const renderer = (req, store, context) => {
  // Render the client code into string
  // Server will understand StaticRouter
  // The static router needs to know what the current "path" (req.path) is what component to show, BrowserRouter figure this out using the url in the browser
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        {/* Currently routes is an array of objects, so we have to render these using "renderRoutes" function provided by "react-router-config" library */}
        <div>{renderRoutes(Routes)}</div>
      </StaticRouter>
    </Provider>
  );

  // This will return the obj, with tags that we have loaded up in the components (Head tags), if we have multiple meta tags, they will be extracted by toString() function
  const helmet = Helmet.renderStatic();

  // This "html" is for adding script tags
  // This bundle.js file will come from static folder "public" that we have specified in app middleware

  // Also inject the initial state into client side redux, and make sure to stringify this

  // Serialize will remove all the malicious code from strings present in data (like xss attacks), this will automatically return string
  const rootHtml = `
    <html>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.INITIAL_STATE = ${serialize(store.getState())}
        </script>
        <script src="bundle.js"></script>
      </body>
    </html>
  `;

  return rootHtml;
};

export default renderer;

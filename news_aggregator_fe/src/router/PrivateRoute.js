import React from 'react';
import { Navigate, Route } from 'react-router';

import NewsAggregator from '../components/newsAggregator/NewsAggregator';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <NewsAggregator />
        ) : (
          <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;

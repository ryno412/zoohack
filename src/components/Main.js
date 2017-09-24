import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import SplashContainer from '../containers/SplashContainer';
import HomeContainer from '../containers/HomeContainer';

const Main = props => (
  <div>
      <AppBar title="Bird Rangers" />
      <Switch>
        <Route exact path="/" component={SplashContainer} />
        <Route exact path="/home" component={HomeContainer} />
      </Switch>
  </div>
);

export default Main;

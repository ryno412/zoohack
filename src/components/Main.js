import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './Components/NavBar';

const Main = props => (
  <div>
    <main>
      <NavBar />
      <Switch>
        <Route exact path="/" component={SplashContainer} />
        <Route exact path="/home" component={HomeContainer} />
        <Route exact path="/404" render={() => <h1>Page Not Found</h1>} />
      </Switch>
    </main>
  </div>
);

export default Main;

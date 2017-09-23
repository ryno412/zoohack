import React from 'react';
import { Link } from 'react-router-dom';

const Splash = props => (
  <Link to="/data">
    <button onClick={() => props.fetchData()}>Go to dashboard</button>
  </Link>
);

export default Splash;

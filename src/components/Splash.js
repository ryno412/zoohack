import React from 'react';
import { Link } from 'react-router-dom';

const Splash = props => (
  <div>
    <Link to="/home">
      <button onClick={props.fetchData}>Go to dashboard</button>
    </Link>
  </div>
);

export default Splash;

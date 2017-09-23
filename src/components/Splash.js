import React from 'react';
import { Link } from 'react-router-dom';

const Splash = props => (
  <div className="header">
    Hello
    <Link to="/data">
      <button onClick={() => props.fetchData()}>Go to dashboard</button>
    </Link>
  </div>
);

export default Splash;

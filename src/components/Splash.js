import React from 'react';
import { Link } from 'react-router-dom';

const Splash = props => {
  console.log('Splash props: ', props);
  return (
    <div className="header">
      Hello
      <Link to="/home">
        <button onClick={props.fetchData}>Go to dashboard</button>
      </Link>
    </div>
  );
};

export default Splash;

import React from 'react';
import Header from './Header';

const Home = props => {
  if (props.loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <Header />
    </div>
  );
};

export default Home;

import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Home = props => {
  console.log('Home props: ', props);
  if (props.loading) {
    return <CircularProgress />;
  }

  return <div>Data</div>;
};

export default Home;

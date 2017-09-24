import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Home = props => {
  if (props.loading) {
    return <CircularProgress />;
  }
  let mapped = props.data.map(item => {
    return (
      <div className="header">
        <div>Name: {item.name}</div>
        <div>Phone: {item.phone}</div>
        <div>Age: {item.age}</div>
      </div>
    );
  });
  return <div>{mapped}</div>;
};

export default Home;

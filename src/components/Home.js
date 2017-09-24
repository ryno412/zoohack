import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Home = props => {
  if (props.loading) {
    return <CircularProgress />;
  }
  // let data = [
  //   {
  //     name: 'John',
  //     phone: '232-324-1432',
  //     age: 11
  //   },
  //   {
  //     name: 'John',
  //     phone: '232-324-1432',
  //     age: 11
  //   }
  // ];

  let mapped = props.data.map((item, i) => {
    return (
      <div key={i} className="item">
        <div>Name: {item.name}</div>
        <div>Phone: {item.phone}</div>
        <div>Age: {item.age}</div>
      </div>
    );
  });

  return (
    <div>
      {mapped.length > 0 ? (
        mapped
      ) : (
        <div className="error">No records found</div>
      )}
    </div>
  );
};

export default Home;

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

    console.log(props.data, 'data');
  let mapped = props.data.map((item, i) => {
    return (
      <div key={i} className="item">
          {item.reports.map(report =>{
              return (<div key={`report${i}`} className="report">
                      <img width="200" height="150" src={report.image}></img>
                      <div>Name: {item.name}</div>
                      <div>Phone: {item.phone}</div>
                  <div> report type {report.reportType}</div>
                  <div> bird {report.bird}</div>
                  <div> location {report.location}</div>
                      {report.imageMeta.map(meta =>{
                          return (<div key={`rr${meta.description}`} className="meta">
                              <div>Description {meta.description} - Score {meta.score}</div>
                          </div>)
                      })}
                  </div>
              )
          })}
      </div>
    );
  });

  return (
    <div>
      {mapped.length > 0 ? (mapped) : (<div className="error">No records found</div>)}
    </div>
  );
};

export default Home;

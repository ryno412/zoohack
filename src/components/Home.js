import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const style = {
    width: '90%',
    margin: '20px auto',
};
const Home = props => {

  if (props.loading) {
    return <CircularProgress />;
  }

  console.log(props.data, 'DDD');
  let mapped = props.data.map((item, i) => {
    return (
    <Paper style={style} zDepth={1} key={i}>
      <div key={i} className="report-container">
          {item.reports.map(report =>{
              return (
                  <div key={`${i}rc`}>
                      <h1 className="report-heading">Field Report</h1>
                      <img width="200" height="150" src={report.image}></img>
                      <div key={`report${i}`} className="report">
                          <h2>Type:{report.reportType}</h2>
                          <div>Reporter: {item.name}</div>
                          <div>Phone: {item.phone}</div>
                          <div> Bird Type {report.bird}</div>
                          <div>Location {report.location}</div>
                      </div>
                      <h3 className="report-heading-sub">Image Analysis</h3>
                      <div className="classifications-container">
                          {report.imageMeta.map((meta, k) =>{
                              return (
                                  <div key={`mm${meta.description}`} className="meta">
                                          <p className="des">{meta.description}</p><p className="score">{(meta.score  * 100).toFixed(0)}%</p></div>)
                          })}
                      </div>
                  </div>  )
          })}
      </div>
    </Paper>
    );
  });

  return (
    <div>
      {mapped.length > 0 ? (mapped) : (<div className="error">No records found</div>)}
    </div>
  );
};

export default Home;

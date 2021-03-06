import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const style = {
    width: '90%',
    margin: '20px auto',
    overflow: 'hidden',
    padding: '18px',
};

class Home extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        const {loading, data} = this.props;
          let mapped = data.map((item, i) => {
    return (

      <div key={i} className="report-container">
          {item.reports.map((report, j) =>{
              return (
                  <Paper style={style} zDepth={1} key={j}>
                  <div key={`${j}drc`}>
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
                                  <div key={`mm${k}`} className="meta">
                                          <p className="des">{meta.description}</p><p className="score">{(meta.score  * 100).toFixed(0)}%</p></div>)
                          })}
                      </div>
                  </div>     </Paper> )
          })}
      </div>

    );
  });


        return do {
            if (loading) {
              <div className="loading-container">
                <CircularProgress />;
              </div>
            } else if (mapped.length > 0) {
              <div>
                  {mapped}
              </div>
            }
              else {
                <div className="error">No records found</div>
                }
            };

        }
}


export default Home;

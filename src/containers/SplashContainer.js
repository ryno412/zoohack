import Splash from '../components/Splash';
import { connect } from 'react-redux';
import dataOperations from '../state/ducks/data/operations';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  fetchData: 'foo'//dataOperations.fetchData
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);

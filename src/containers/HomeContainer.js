import Home from '../components/Home';
import { connect } from 'react-redux';
import dataOperations from '../state/ducks/data/operations';

const mapStateToProps = state => ({
  loading: state.data.loading,
  data: state.data.data
});
const mapDispatchToProps = {
    fetchData: dataOperations.fetchData
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);

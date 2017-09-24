import Home from '../components/Home';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  loading: state.data.loading,
  data: state.data.data
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

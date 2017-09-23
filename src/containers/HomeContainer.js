import Splash from '../components/Splash';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  loading: state.data.loading,
  data: state.data.data
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);

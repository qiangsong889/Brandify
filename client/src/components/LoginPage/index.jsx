import React from 'react';
import axios from 'axios';
import { getSessionIdToRedux } from '../../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.css';
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: 'codingchallenge@brandify.com',
      password: 'appl!c@nt'
    };
  }
  async handleSubmit() {
    try {
      const response = await axios.post(
        'https://one-staging-api.brandify.com/service/user/authenticate',
        this.state
      );
      this.props.updateSessionId(response.data.session.sessionId);
      this.props.getSessionIdToRedux(response.data.session.sessionId);
    } catch (err) {
      console.log('err posting to brandify', err);
    }
  }
  render() {
    return (
      <div>
        username:
        <input
          type="text"
          onChange={e => this.setState({ username: e.target.value })}
        />
        <br />
        password
        <input
          type="text"
          onChange={e => this.setState({ password: e.target.value })}
        />
        <br />
        <button onClick={() => this.handleSubmit()}>submit</button>
      </div>
    );
  }
}
function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSessionIdToRedux: getSessionIdToRedux
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

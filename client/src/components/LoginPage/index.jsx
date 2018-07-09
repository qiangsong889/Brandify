import React from 'react';
import axios from 'axios';
import { getSessionIdToRedux } from '../../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.css';
import Popup from 'reactjs-popup';
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: 'codingchallenge@brandify.com',
      password: 'appl!c@nt',
      err: false
    };
  }
  closeModal() {
    this.setState({ err: false });
  }
  async handleSubmit() {
    try {
      const response = await axios.post(
        'https://one-staging-api.brandify.com/service/user/authenticate',
        this.state
      );
      console.log('response', response);
      if (response.data.status.code === 1) {
        this.props.updateSessionId(response.data.session.sessionId);
        this.props.getSessionIdToRedux(response.data.session.sessionId);
      } else {
        this.setState({
          err: true
        });
      }
    } catch (err) {
      console.log('err posting to brandify', err);
    }
  }
  render() {
    return (
      <div id="loginPage">
        <div id="login">
          <input
            placeholder="Username"
            type="text"
            onChange={e => this.setState({ username: e.target.value })}
          />
          <br />
          <input
            placeholder="Password"
            type="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <br />
          <ul>
            <li>
              <a
                href="#"
                className="round green"
                onClick={() => this.handleSubmit()}
              >
                Login<span className="round">
                  That is, if you already have an account.
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="round red">
                Sign Up<span className="round">
                  Oooops! Sorry~ Sign up is not suportted!!!!
                </span>
              </a>
            </li>
          </ul>
        </div>
        <Popup
          open={this.state.err}
          closeOnDocumentClick
          onClose={() => this.closeModal()}
        >
          <div className="modal">
            <a className="close" onClick={() => this.closeModal()}>
              &times;
            </a>
            Username or Password Incorrect
          </div>
        </Popup>
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

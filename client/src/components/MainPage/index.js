import React from 'react';
import Login from '../LoginPage/index';
import Map from '../MapPage/index';
class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionId: null
    };
    this.updateSessionId = this.updateSessionId.bind(this);
  }
  updateSessionId(id) {
    this.setState({
      sessionId: id
    });
  }
  render() {
    return (
      <div>
        {this.state.sessionId ? (
          <Map />
        ) : (
          <Login updateSessionId={this.updateSessionId} />
        )}
      </div>
    );
  }
}

export default Main;

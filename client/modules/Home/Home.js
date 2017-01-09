import React, { PropTypes, Component } from 'react';

import {Grid, Row, Col} from 'react-bootstrap';

class HomePage extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        Welcome Home.
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.


HomePage.propTypes = {
};

HomePage.contextTypes = {
  router: React.PropTypes.object,
};

export default HomePage;

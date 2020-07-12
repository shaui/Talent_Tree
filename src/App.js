import React, { Component } from 'react';
import { CustomNavbar } from './widgets';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

class App extends Component {
  render() {
    return (
    	<div className="">
    		<div className="main">
	    		<CustomNavbar/>

          {/* use renderRoutes method here*/}
          {renderRoutes(routes)}
	    	</div>
    	</div>
    )
  }
}

export default App;
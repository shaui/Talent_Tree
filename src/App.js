import React, { Component } from 'react';
import { CustomNavbar } from './widgets';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

class App extends Component {

  componentDidMount(){
    // var origin_this = this
    // myRef.once('value', function (snapshot) {
    //     data = snapshot.val()
    //     console.log('666', data)
    //     origin_this.setState({
    //       treeData: data
    //     })
    //     console.log(origin_this.state.treeData)
    // }) 
  }
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
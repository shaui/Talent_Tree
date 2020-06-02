import React, { Component } from 'react';
import { CustomNavbar } from './components';
import { Route } from 'react-router-dom';
import PostingPage from './forum';
import MyTree from './components/MyTree'
import treeData from './Database/talent tree.json'

var data = treeData

class App extends Component {
  render() {
    return (
    	<div className="">
    		<div className="main">
	    		<CustomNavbar/>
          <Route
            path="/"
            exact
            render={(props) => <MyTree data={data} />}/>
          

	    		<Route path="/forum" component={PostingPage} />
	    	</div>
    	</div>
    )
  }
}

export default App;
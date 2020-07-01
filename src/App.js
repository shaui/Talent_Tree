import React, { Component } from 'react';
import { CustomNavbar } from './components';
import { Route } from 'react-router-dom';
import PostingPage from './forum';
import MyTree from './components/MyTree'
import CoursePage from './components/CoursePage'
// import treeData from './Database/talent tree.json'
import treeData from './Database/talent tree mis 0606.json'

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
          <Route path="/coursePage" component={CoursePage} />
	    	</div>
    	</div>
    )
  }
}

export default App;
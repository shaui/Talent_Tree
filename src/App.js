import React, { Component } from 'react';
import { CustomNavbar } from './components';
import { Route } from 'react-router-dom';
import PostingPage from './forum';
import MyTree from './components/MyTree'
import CoursePage from './components/CoursePage'
import Firebase from './Utils/FirebaseMg.js'
import treeData from './Database/PythonTree.json'
// import treeData from './Database/talent tree mis 0606.json'

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
          <Route
            path="/"
            exact
            component={MyTree}/>
          
	    		<Route path="/forum" component={PostingPage} />
          <Route path="/coursePage" component={CoursePage} />
          <Route path="/firebase" component={Firebase} />
	    	</div>
    	</div>
    )
  }
}

export default App;
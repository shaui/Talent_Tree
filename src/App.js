import React, { Component } from 'react';
import { Route } from 'react-router-dom';

//Component
import CustomNavbar from './Utils/CustomNavbar';
import SideBar from './Utils/SideBar.js'
import MyTree from './components/MyTree.js' ;
import PostsPage from './components/Forum.js' ;
import PostingPage from './components/PostingPage.js' ;
import CoursePage from './components/CoursePage'
import SignInPage from './components/SignInPage.js'
import HomePage from './components/HomePage.js';
import TreeMenu from './components/TreeMenu.js'

import { renderRoutes } from 'react-router-config';
import routes from './routes';
// import treeData from './Database/PythonTree.json'
// import treeData from './Database/talent tree mis 0606.json

//Firebase Auth
import firebase from 'firebase';
import FirebaseMg from './Utils/FirebaseMg.js'
import UserContext from './Contexts/UserContext'

const fbMg = new FirebaseMg()
var root = fbMg.myRef

class App extends Component {

  static contextType = UserContext;

  constructor(props){
    super(props)
    this.state = {
      user: null
    }
  }

  initUserData = (userID) => {
    console.log("666", userID)

    var myRef = root.child('Users/' + userID)

    myRef.once('value', function (snapshot) {
        //取得tree data
        let data = snapshot.val()
        if(data){
          console.log('myRef:', data)
        }else{
          console.log('myRef: cannot find the user.')
          var insertNode = root.child('Users')
          var initData = new Object()
          initData[userID] = {
            history: 666,
            userState: 777
          }
          insertNode.update(initData)
        }
        
    })
  }

  componentDidMount = () =>{
    console.log("context:", this.context)
    firebase.auth().onAuthStateChanged(userAuth => {
      if(userAuth){
        console.log('App user:', userAuth, userAuth.uid)
        this.initUserData(userAuth.uid)
      }else{
        console.log('App user:', userAuth)
      }
      this.setState({ user: userAuth});
    })
  }

  render() {
    return (
      <UserContext.Provider value={{user: this.state.user}}>
      	<div className="">
      		<div className="main">
  	    		<CustomNavbar/>
            <SideBar />

            <Route exact path="/" component={MyTree} />
            <Route exact path="/forum" component={PostsPage} />
            <Route exact path="/forum/post" component={PostingPage} />
            <Route exact path="/coursePage" component={CoursePage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/treeMenu" component={TreeMenu} />
  	    	</div>
      	</div>
      </UserContext.Provider>
    )
  }
}

export default App;
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

//Component
import CustomNavbar from './Utils/CustomNavbar';
import CustomBreadcrumb from './Utils/CustomBreadcrumb.js'
import SideBar from './Utils/SideBar.js'
import MyTree from './components/MyTree.js' ;
import PostsPage from './components/Forum.js' ;
import PostingPage from './components/PostingPage.js' ;
import CoursePage from './components/CoursePage' ;
import SignInPage from './components/SignInPage.js' ;
import HomePage from './components/HomePage.js' ;
import TreeMenu from './components/TreeMenu.js' ;
import HuntingPage from './components/HuntingPage.js' ;
import Profile from './components/Profile.js' ;
import Home from './components/Home.js'

import { renderRoutes } from 'react-router-config';
import routes from './routes';
// import treeData from './Database/PythonTree.json'
// import treeData from './Database/talent tree mis 0606.json

//Firebase Auth
import firebase from 'firebase';
import FirebaseMg from './Utils/FirebaseMg.js'
import UserContext from './Contexts/UserContext'

//initial user data
import basicUserData from './Database/basicUserData.json'


const fbMg = new FirebaseMg()
var root = fbMg.myRef

class App extends Component {

  static contextType = UserContext;

  constructor(props){
    super(props)
    this.state = {
      user: null
    }
    console.log("APP Construt")

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
          initData[userID] = basicUserData
          insertNode.update(initData)
        }
        
    })
  }

  initAuth(){
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

  componentDidMount = () =>{
    this.initAuth()
  }

  render() {
    return (
      <UserContext.Provider value={{user: this.state.user}}>
      	<div className="">
      		<div className="main">
  	    		<CustomNavbar />
            {
              this.state.user ?
                <SideBar />
              : null 
            }
            <div id="breadcrumb-div" style={{ 'position': 'fixed', 'top': '12vh', 'left': '8vh', 'zIndex':'98' }}>
              <div className="container breadcrumb-container">
                <div className="row">
                  <div className="col">
                    <CustomBreadcrumb path={this.props.location.pathname} params={this.props.location.state} />
                  </div>
                </div>
              </div>
            </div>
            <Route exact path="/" component={Home} />
            <Route exact path="/treeMenu/tree" component={MyTree} />
            <Route exact path="/forum" component={PostsPage} />
            <Route exact path="/forum/post" component={PostingPage} />
            <Route exact path="/hunt" component={HuntingPage} />
            <Route exact path="/forum/course" component={CoursePage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/treeMenu" component={TreeMenu} />
            <Route exact path="/profile" component={Profile} />
  	    	</div>
      	</div>
      </UserContext.Provider>
    )
  }
}

export default App;
import React, { Component } from 'react';
import { CustomNavbar } from './components';
import { Route } from 'react-router-dom';

//Component
import PostingPage from './forum';
import MyTree from './components/MyTree'
import CoursePage from './components/CoursePage'
import SignInPage from './components/SignInPage.js'
import SideBar from './Utils/SideBar.js'
import HomePage from './components/HomePage.js'
import TreeMenu from './components/TreeMenu.js'
import Checkwindow from './Utils/Checkwindow.js'
// import treeData from './Database/PythonTree.json'
// import treeData from './Database/talent tree mis 0606.json'

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
            <Route
              path="/"
              exact
              component={MyTree}/>
            
  	    		<Route exact path="/forum" component={PostingPage} />
            <Route exact path="/signIn" component={SignInPage} />
            <Route exact path="/coursePage" component={CoursePage} />
            <Route exact path="/sideBar" component={SideBar} />

            <Route exact path="/home" component={HomePage} />
            <Route exact path="/treeMenu" component={TreeMenu} />
            <Route exact path="/check" component={Checkwindow} />

  	    	</div>
      	</div>
      </UserContext.Provider>
    )
  }
}

export default App;
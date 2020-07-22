import React, { Component } from 'react';
import CustomNavbar from './Utils/CustomNavbar';
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

            {/* use renderRoutes method here*/}
            {renderRoutes(routes)}
  	    	</div>
      	</div>
      </UserContext.Provider>
    )
  }
}

export default App;
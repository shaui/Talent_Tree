import React, {Component} from 'react';
import { Button, Modal } from 'react-bootstrap';
import './SignInPage.css'
//FireBase
import FirebaseMg from '../Utils/FirebaseMg.js'
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import UserContext from '../Contexts/UserContext'

const fbMg = new FirebaseMg()
var myRef = fbMg.myRe

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks:{
  	signInSuccessWithAuthResult: () => {
  		return false
  	}
  }
};

class SignInPage extends Component{
	static contextType = UserContext;
	constructor(props){
		super(props)
		this.state = {
			isShow: false
		}
	}
	
	handleClose = () => {
		this.setState({
			isShow: false
		})
	}

	handleShow = () => {
		this.setState({
			isShow: true
		})
	}

	render(){
		let user = this.context.user
		console.log("SignInPage:", this.context, user)
		if(user){
			return(
				<div style={{'margin-top':'12vh'}}>
					<h1>Sign In</h1>
					<button onClick={() => firebase.auth().signOut()}>Sign out!</button>
				</div>
			)
		}else{
			return(
		      <div style={{'margin-top':'12vh'}}>
		          <Button variant="primary" onClick={this.handleShow}>
			       	會員登入
			      </Button>
		          <Modal show={this.state.isShow} onHide={this.handleClose}>

			        <Modal.Body>
			        	<h1 className='headFont'>Talent-Tree</h1>
			        	<p style={{'text-align': 'center', 'paddingBottom':'10px'}}>Sing in to Talent-Tree here</p>
						<div style={{'margin': '0'}}>
							<input type="text" />

						</div>
						
						<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={fbMg.auth} />
			        </Modal.Body>

			      </Modal>
				
		      </div>
			)
		}
		
	}
}

export default SignInPage;
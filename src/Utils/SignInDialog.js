import React, {Component} from 'react';
import { Button, Modal } from 'react-bootstrap';
import './SignInDialog.css'
//FireBase
import FirebaseMg from '../Utils/FirebaseMg.js'
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const fbMg = new FirebaseMg()
var myRef = fbMg.myRe



class SignInDialog extends Component{
	constructor(props){
		super(props)
		this.state = {
			
		}
	}

	// Configure FirebaseUI.
	uiConfig = {
	  // Popup signin flow rather than redirect flow.
	  signInFlow: 'popup',
	  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
	  signInSuccessUrl: '/home',
	  // We will display Google and Facebook as auth providers.
	  signInOptions: [
	    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	    firebase.auth.FacebookAuthProvider.PROVIDER_ID
	  ],
	  callbacks:{
	  	signInSuccessWithAuthResult: () => {
	  		this.props.handleClose() //Close the Modal
	  		return true
	  	}
	  }
	};


	render(){
		return(
	      <div style={{'margin-top':'12vh'}}>
	          <Modal dialogClassName="SignInDialog coutom-model" show={this.props.isShow} onHide={this.props.handleClose}>

		        <Modal.Body>
		        	<h1 className='SignInDialog headFont'>Talent-Tree</h1>
		        	<p style={{'textAlign': 'center'}}>Sing in to Talent-Tree here</p>
					<div className='SignInDialog sign-div'>
						<input class="SignInDialog sign-msg" type="text" name="email" placeholder="Email"/><br/>
					  	<input class="SignInDialog sign-msg" type="password" name="pwd" placeholder="Password"/><br/>
						<div class="SignInDialog sign-btn">
							<Button variant="primary" style={{'float':'left', 'width':'48%', 'margin':'0px'}}>
								Sign In
							</Button>
							<Button variant="primary" style={{'float':'right', 'width':'48%', 'margin':'0px'}}>
								Sign Up
							</Button>
						</div>
						
					</div>
					
					<StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={fbMg.auth} />
		        </Modal.Body>

		      </Modal>
			
	      </div>
		)
		
		
	}
}

export default SignInDialog;
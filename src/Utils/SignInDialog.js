import React, {Component} from 'react';
import { Button, Modal } from 'react-bootstrap';
import './SignInDialog.css'
import $ from 'jquery'
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
		this.signInHandler = this.signInHandler.bind(this)
		this.signUpHandler = this.signUpHandler.bind(this)
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

	signInHandler(){
    	$("#pwd").css("background","white")
    	$("#pwd").css("border","1px solid black")
    	$("#pwd").css("border-radius","2px")
    	$("#email").css("background","white")
    	$("#email").css("border","1px solid black")
    	$("#email").css("border-radius","2px")
		let email = document.getElementsByName('email')[0].value
		let password = document.getElementsByName('pwd')[0].value

		console.log("信箱:", email, "，密碼:", password)
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
			this.props.handleClose()
		}).catch(function(error) {
	        // Handle Errors here.
	        var errorCode = error.code;
	        var errorMessage = error.message;
	        if(errorCode === 'auth/wrong-password') {
	        	alert('Wrong password.')
	        	$("#pwd").css("background","rgba(255,100,100,0.6)")
	        	$("#pwd").css("border","1.5px solid red")
	        	$("#pwd").css("border-radius","2px")
	        }else if(errorCode === 'auth/user-not-found'){
	        	alert('Email is incorrect')
	        	$("#email").css("background","rgba(255,100,100,0.6)")
	        	$("#email").css("border","1.5px solid red")
	        	$("#email").css("border-radius","2px")
	        }else if(errorCode === 'auth/invalid-email'){
	        	alert('Please enter a valid email address')
	        	$("#email").css("background","rgba(255,150,150,0.6)")
	        	$("#email").css("border","1.5px solid red")
	        	$("#email").css("border-radius","2px")
	        }else{
	        	alert(errorCode)
	        	alert(errorMessage);
	        }
	        console.log(error);
	    });
	}

	signUpHandler(){
    	$("#pwd").css("background","white")
    	$("#pwd").css("border","1px solid black")
    	$("#pwd").css("border-radius","2px")
    	$("#email").css("background","white")
    	$("#email").css("border","1px solid black")
    	$("#email").css("border-radius","2px")
		let email = document.getElementsByName('email')[0].value
		let password = document.getElementsByName('pwd')[0].value

		console.log("信箱:", email, "，密碼:", password)
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
			this.props.handleClose()
		}).catch(function(error) {
	        // Handle Errors here.
	        var errorCode = error.code;
	        var errorMessage = error.message;
	        console.log(error);

	        if(errorCode === 'auth/email-already-in-use'){
	        	alert('This email address is already registered')
	        	$("#email").css("background","rgba(255,100,100,0.6)")
	        	$("#email").css("border","1.5px solid red")
	        	$("#email").css("border-radius","2px")
	        }else if(errorCode === 'auth/invalid-email'){
	        	alert('Please enter a valid email address')
	        	$("#email").css("background","rgba(255,100,100,0.6)")
	        	$("#email").css("border","1.5px solid red")
	        	$("#email").css("border-radius","2px")
	        }else{
	        	alert(errorMessage);
	        }
	    });
	}

	render(){
		return(
	      <div style={{'margin-top':'12vh'}}>
	          <Modal dialogClassName="SignInDialog coutom-model" show={this.props.isShow} onHide={this.props.handleClose}>

		        <Modal.Body>
		        	<h1 className='SignInDialog headFont'>Talent-Tree</h1>
		        	<p style={{'textAlign': 'center'}}>Sing in to Talent-Tree here</p>
					<div className='SignInDialog sign-div'>
						<input className="SignInDialog sign-msg" id="email" type="text" name="email" placeholder="Email"/><br/>
					  	<input className="SignInDialog sign-msg" id="pwd" type="password" name="pwd" placeholder="Password"/><br/>
						<div className="SignInDialog sign-btn">
							<Button variant="primary" onClick={this.signInHandler} style={{'float':'left', 'width':'48%', 'margin':'0px'}}>
								Sign In
							</Button>
							<Button variant="primary" onClick={this.signUpHandler} style={{'float':'right', 'width':'48%', 'margin':'0px'}}>
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
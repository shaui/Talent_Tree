import React, { Component } from 'react';

//Firebase
import firebase from 'firebase';
import config from '../firebaseConfig';
import 'firebase/auth';


class FirebaseMg extends Component{
	constructor(props) {
		super(props);
		if (!firebase.apps.length) {
			this.app = firebase.initializeApp(config);
		} else {
			this.app = firebase.app();
		}

		this.database = this.app.database();
		this.myRef = this.database.ref();
		this.auth = this.app.auth();
	}

}

export default FirebaseMg;
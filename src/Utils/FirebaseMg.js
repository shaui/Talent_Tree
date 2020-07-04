import React, { Component } from 'react';
import firebase from 'firebase';
import config from '../firebaseConfig';

class FirebaseMg extends Component{
	constructor(props) {
		super(props);
		if (!firebase.apps.length) {
			this.app = firebase.initializeApp(config);
		} else {
			this.app = firebase.app();
		}

		this.database = this.app.database();
		this.myRef = this.database.ref()
	}
}

export default FirebaseMg;
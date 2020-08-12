import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import './Home.css';
import $ from 'jquery'

import SignInDialog from '../Utils/SignInDialog.js'
import firebase from 'firebase';

class Home extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			show : false,
			user: null
		}
	}

	componentDidMount = () =>{
    	console.log("context:", this.context)
    	firebase.auth().onAuthStateChanged(userAuth => {
    		console.log('userAuth', userAuth)
		    this.setState({ 
		        user: userAuth
		    })
	    })

	    let today = new Date().getMonth()+1
	    console.log('Today:',today)
	    if(today==3 || today==4 || today==5){
	    	$("#col1").attr("class", "Home col1 col spring")
	    }else if(today==6 || today==7 || today==8){
	    	$("#col1").attr("class", "Home col1 col summer")
	    }else if(today==9 || today==10 || today==11){
	    	$("#col1").attr("class", "Home col1 col fall")
	    }else{
	    	$("#col1").attr("class", "Home col1 col winter")
	    }
  	}

	handleShow(){
		this.setState({
			show : true
		})
	}

	handleClose(){
		this.setState({
			show : false
		})
	}

	render(){
		let userComponent;
		if(!this.state.user){
			userComponent = (
				<div style={{'margin':'0 10vw'}}>
					<p style={{'textAlign':'left', 'fontSize':'18px'}}>現在加入，建構屬於自己的技能樹</p>
					<Button className='Home buttons' onClick={() => this.handleShow()} variant="primary" size="lg" block>登入</Button>
					<Button className='Home buttons' onClick={() => this.handleShow()} variant="outline-primary" size="lg" block>註冊</Button>
				</div>
			)
		}else{
			userComponent = (
				<div style={{'margin':'0 10vw', 'fontSize':'18px'}}>
					<p style={{'textAlign':'left'}}>士別三日，當刮目相看</p>
					<Button className='Home buttons' variant="primary" size="lg" block onClick={() => firebase.auth().signOut()}>會員登出</Button>
				</div>
			)
		}

		return(
			<Row className="Home row">
				<Col className="Home col1" id="col1">
					<div className="Home component1">
						<p>
							<i className="fa fa-assistive-listening-systems" style={{'fontSize':'30px', 'marginLeft':'8px', 'marginRight':'5px'}}></i> 瞭解當前業界趨勢，讓你有效學習知識
						</p><br/>
						<p>
							<i className="fa fa-book" style={{'fontSize':'30px', 'marginLeft':'8px', 'marginRight':'8px'}}></i> 開放式整合平台，彙整各渠道學習資源
						</p><br/>
						<p>
							<i className="fa fa-handshake-o" style={{'fontSize':'30px', 'marginRight':'5px'}}></i> 讓學生與企業互動，縮短雙方認知差距
						</p><br/>
					</div>
				</Col>
				<Col className="Home col2">
					<div className="Home component2">
						<img src='https://imgur.com/eX6UTGe.png' alt="react-router-breadcrumb" width="70" height="70" style={{'verticalAlign':'middle'}} />
						<br/>
						<b style={{'fontSize':'18px'}}>HOKMAH</b>
						<br/>
						<b style={{'fontSize':'25px'}}>願每個人心中的種子，都能成長綻放成美麗的大樹</b>
						<br/><br/><br/>
						{userComponent}
					</div>
				</Col>
				<SignInDialog isShow={this.state.show} handleClose={() => this.handleClose()}/>
			</Row>
		)
	}
}

export default Home;
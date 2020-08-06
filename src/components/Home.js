import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import './Home.css';

import logo from '../Database/tree-logo.png';
import UserContext from '../Contexts/UserContext.js'
import SignInDialog from '../Utils/SignInDialog.js'
import firebase from 'firebase';

class Home extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			show : false
		}
		this.handleShow = this.handleShow.bind(this)
		this.handleClose = this.handleClose.bind(this)
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
					<p style={{'text-align':'left'}}>現在加入，建構屬於自己的技能樹</p>
					<Button className='Home buttons' onClick={this.handleShow} variant="primary" size="lg" block>登入</Button>
					<Button className='Home buttons' onClick={this.handleShow} variant="outline-primary" size="lg" block>註冊</Button>
				</div>
			)
		}else{
			userComponent = (
				<div style={{'margin':'0 10vw'}}>
					<p style={{'text-align':'left'}}>士別三日，當刮目相看</p>
					<Button className='Home buttons' variant="primary" size="lg" block onClick={() => firebase.auth().signOut()}>會員登出</Button>
				</div>
			)
		}

		return(
			<Row className="Home row">
				<Col className="Home col1">
					<div className="Home component1">
						<p>
							<i className="fa fa-assistive-listening-systems" style={{'font-size':'30px', 'marginLeft':'8px', 'marginRight':'5px'}}></i> 瞭解當前業界趨勢，讓你有效學習知識
						</p><br/>
						<p>
							<i className="fa fa-book" style={{'font-size':'30px', 'marginLeft':'8px', 'marginRight':'8px'}}></i> 開放式整合平台，彙整各渠道學習資源
						</p><br/>
						<p>
							<i className="fa fa-handshake-o" style={{'font-size':'30px', 'marginRight':'5px'}}></i> 讓學生與企業互動，縮短雙方認知差距
						</p><br/>
					</div>
				</Col>
				<Col className="Home col2">
					<div className="Home component2">
						<img src={logo} alt="react-router-breadcrumb" width="70" height="70" style={{'vertical-align':'middle'}} />
						<br/>
						<b style={{'font-size':'18px'}}>HOKMAH</b>
						<br/>
						<b style={{'font-size':'25px'}}>願每個人心中的種子，都能成長綻放成美麗的大樹</b>
						<br/><br/><br/>
						{userComponent}
					</div>
				</Col>
				<SignInDialog isShow={this.state.show} handleClose={this.handleClose}/>
			</Row>
		)
	}
}

export default Home;
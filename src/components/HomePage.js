import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'
import $ from 'jquery'
import {ProgressBar} from 'react-bootstrap';

//Component
import CustomerSpinner from '../Utils/CustomerSpinner'

//FireBase
import FirebaseMg from '../Utils/FirebaseMg.js'

//Context
import UserContext from '../Contexts/UserContext'

const fbMg = new FirebaseMg()
var root = fbMg.myRef


function Record(props) {

  return (
		<div className="HomaPage card">
			<div className="HomaPage card-body">

				<div className="HomaPage circular-avatar float-left">
					<img src="http://petonea.com/file//n373/t.jpg" className="HomaPage card-avatar"/>
				</div>
				<div className="HomaPage content">
					<h5 className="HomaPage user-name">正在學習 {props.skillName}</h5>
					<ProgressBar striped variant="success" now={props.progress} label={`${props.progress}%`} style={{"height":"25px"}}/>
				</div>
				<br/>

				<div className="HomaPage actions" style={{"marginTop":"5px", "font-size":"15px"}}>
					{
						props.stdArray.map( std =>(
							<span className='HomePage tag'>✔ {std}</span>
						))
					}
					<span>
						<Link to={{
							pathname:"/forum",
		          			state:{"path":props.skillName}
						}} className="HomePage right">前往課程</Link>				
					</span>
				</div>
			</div>
		</div>
  );
}

class HomePage extends Component{
	static contextType = UserContext;
	constructor(props){
		super(props)
		this.state = {
			isLoading: true,
			recordData: null
		}
	}

	componentDidMount(){
		fbMg.auth.onAuthStateChanged(userAuth =>{
			let path = 'Users/' + userAuth.uid + "/progress"
			let myRef = root.child(path)

			myRef.once('value', (snapshot) =>{
				let data = snapshot.val()
				let recordData = []
				
				console.log("Home Progress:", data)

				for(var key in data){
					let skillDataArray = [] //用來記錄所有skill的資料

					let skillData = data[key]
					let progress = Math.round(skillData["completed"]*100)
					console.log("Progress:", progress)

					skillDataArray.push(key)
					skillDataArray.push(skillData["children"])
					skillDataArray.push(progress)
					console.log("skillDataArray:",skillDataArray)

					recordData.push(skillDataArray)
				}

				this.setState({
					isLoading: false,
					recordData: recordData
				})

			}).then(() =>{
				
			})					
		})


	}

	initData(user){

	}

	render(){

		
		return(
			<div className='container' style={{'marginTop':'10vh'}}>
				<div className='HomaPage row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<div className="container card-container">
							<h3>近期活動</h3>
							<hr/>
							{
								this.state.isLoading ?
									<CustomerSpinner />	
								:
									<div className="row justify-content-center">
										{	
											this.state.recordData.length > 0 ?
												this.state.recordData.map((skillArr, index) =>(
													<Record key={index} 
													skillName={skillArr[0]}  
													stdArray={skillArr[1]} 
													progress={skillArr[2]} />
												))
											:
												<div key='x' className="text-center HomePage activity" style={{'color':'grey'}}>尚未進行任何活動!</div>
										}
									</div>					
							}
						</div>
					</div>
				</div>
			</div>			
		)
	}
}

export default HomePage;
import React, {Component} from 'react';
import './HomePage.css'
import $ from 'jquery'

function Record(props) {
  return (
		<div className="HomaPage card">
			<div className="HomaPage card-body">

				<div className="HomaPage circular-avatar float-left">
					<img src="http://petonea.com/file//n373/t.jpg" className="HomaPage card-avatar"/>
				</div>
				<div className="HomaPage content">
					<h5 className="HomaPage user-name">2020/9/9</h5>
					<p className="HomaPage card-text">
						關注了Tensorflow For CNN Cifar-10
					</p>
				</div>
				<div className="HomaPage actions">
					<a href="#">
						<span className="HomaPage glyphicon glyphicon-heart" aria-hidden="true"></span>
					</a>
				</div>
			</div>
		</div>
  );
}

class HomePage extends Component{
	constructor(props){
		super(props)
		this.state = {

		}
	}

	render(){
		return(
			<div className='container' style={{'paddingTop':'10vh'}}>
				<div className='HomaPage row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<div className="container card-container">
							<h3>近期活動</h3>
							<hr/>
							<div className="row">
								<Record />
								<Record />
								<Record />
								<Record />
								<Record />
								<Record />
								<Record />
								<Record />
								<Record />
								<Record />
							</div>
						</div>
					</div>
				</div>
			</div>			
		)
	}
}

export default HomePage;
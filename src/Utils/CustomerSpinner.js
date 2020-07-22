import React, {Component} from 'react';
import './CustomerSpinner.css'

class CustomerSpinner extends Component{
	render(){
		return(
			<div className="CustomerSpinner container spinner-container">
				<div className="CustomerSpinner d-flex justify-content-center align-items-center w-100 h-100">
					<div className="CustomerSpinner spinner-grow text-primary" role="status">
					  <span className="CustomerSpinner sr-only">Loading...</span>
					</div>
					<div className="CustomerSpinner spinner-grow text-secondary" role="status">
					  <span className="CustomerSpinner sr-only">Loading...</span>
					</div>
					<div className="CustomerSpinner spinner-grow text-dark" role="status">
					  <span className="CustomerSpinner sr-only">Loading...</span>
					</div>
				</div>	
			</div>
		)
	}
}

export default CustomerSpinner;
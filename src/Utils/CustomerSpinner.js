import React, {Component} from 'react';
import './CustomerSpinner.css'

class CustomerSpinner extends Component{
	render(){
		return(
			<div class="container">
				<div class="d-flex justify-content-center align-items-center w-100 h-100">
					<div class="spinner-grow text-primary" role="status">
					  <span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-secondary" role="status">
					  <span class="sr-only">Loading...</span>
					</div>
					<div class="spinner-grow text-dark" role="status">
					  <span class="sr-only">Loading...</span>
					</div>
				</div>	
			</div>
		)
	}
}

export default CustomerSpinner;
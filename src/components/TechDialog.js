import React, {Component} from 'react';
import './TechDialog.css';
import $ from 'jquery'

class TechDialog extends Component{
	constructor(props){
		super(props)
		this.state = {
			title: props.title,
			context: props.context,
		}
		this.onMouseLeaveHnadler = this.onMouseLeaveHnadler.bind(this)
	}

	onMouseLeaveHnadler(){
		console.log("onMouseLeaveHnadler")
		let $dialog = $('.techDialog')
		$dialog.css({
			'display': 'none'
		})
	}

	render() {
		console.log(this.props.style)
		let $dialog = $('.techDialog')
		$dialog.css(this.props.style)
		return (
			<div className="techDialog" onMouseLeave={this.onMouseLeaveHnadler}>
				<img src="https://www.woniuxy.com/train/img/python1.png" alt="None"/>
				<h5 style={{'display':'inline-block'}}>{this.props.title}</h5>
				<p></p>
				<p>{this.props.context}</p>
				<a href="/forum">前往課程......</a>
			</div>
		);
	}
}

export default TechDialog;
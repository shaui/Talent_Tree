import React, {Component} from 'react';
import { Link } from 'react-router-dom';
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

		let contextList = this.props.context

		var i = 1
		if(contextList.length > 0){
			var contexts = contextList.map((context, index) =>
				<p key = {index}>
					{index+1}. {context}
				</p>
			);
		}

		

		// console.log(contexts)
		return (
			<div className="TechDialog techDialog" onMouseLeave={this.onMouseLeaveHnadler}>
				<h5>{this.props.title}</h5>
				<hr/>
				<p>課程標準：</p>
				<br/>
				{contexts}
				<br/>
				<Link to={{
					pathname:"/forum",
          			state:{"path":this.props.path}
				}} style={{'float':'right'}}>前往課程 &rarr;</Link>
			</div>
		);
	}
}

export default TechDialog;
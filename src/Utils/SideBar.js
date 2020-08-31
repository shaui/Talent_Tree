import React, {Component} from 'react';
import {withRouter} from "react-router-dom"

//SideBar component
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class SideBar extends Component{
	constructor(props){
		super(props)
		this.state = {
			top: "10vh"
		}
	}

	componentDidMount() {
		const navHeight = document.querySelector(".navbar").clientHeight
		this.setState( {
			top: navHeight + "px"
		} )
	}

	render(){
		return(
				<SideNav
				    onSelect={(selected) => {
				        console.log("onSelect:", selected)
				        const url = "/" + selected
				        this.props.history.push(url)
				    }}

				    style={{'position':'fixed','top': this.state.top}}
				>
				    <SideNav.Toggle />
				    <SideNav.Nav defaultSelected=" ">
				        <NavItem eventKey="home">
				            <NavIcon>
									<i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />		            	
				            </NavIcon>
				            <NavText>
					                Home
				            </NavText>
				        </NavItem>
				        <NavItem eventKey="profile">
				            <NavIcon>
				            		<i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />				            	
				            </NavIcon>
				            <NavText>
				                	History
				            </NavText>
				        </NavItem>
				        <NavItem eventKey="treeMenu">
				            <NavIcon>
				                	<i className="fa fa-fw fa-tree" style={{ fontSize: '1.75em' }} />
				            </NavIcon>
				            <NavText>
				                	Tree	                
				            </NavText>
				        </NavItem>
				    </SideNav.Nav>
				</SideNav>
		)
	}
}

export default withRouter(SideBar);
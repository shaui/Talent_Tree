import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Icon } from '../scroll_v3_final.svg'
import '../Utils/ScrollIcon.css';

function SubskillList(props) {

	const [click, setClick] = useState(false);

	const handleClick = (e) => {
		setClick(!click)
	}

	const isInitialMount = useRef(true);
	useEffect((e) => {
		if (isInitialMount.current) {
	       isInitialMount.current = false;
	    } else {
	      props.handleClick(e)
	    }
  	}, [click]);

	const skillObj = props.skillObj

	const subskillList = skillObj.children.map( (subskill) => 
		<li>
			<i className="fa fa-book" aria-hidden="true"></i>
			<Link to={ `/forum/${ subskill.name }` } className="link">
				{ subskill.name }
				<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
			</Link>
		</li>
	)


	return (
		<li>
			<i className="fa fa-graduation-cap" aria-hidden="true"></i>
				{ skillObj.name }
			{
				click ? 
				<button onClick={ handleClick } >
					<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
				</button>
				 :
				 <button onClick={ handleClick } >
					<i className="fa fa-arrow-circle-down" aria-hidden="true"></i>
				</button>
			}
			{
				click ? 
				<ul className="subskills">
					{ subskillList }
				</ul> :
				""
			}
		</li>
	)

}

function ForumList(props) {

	const skills = props.fieldObj.children

	const unfoldList = skills.map( ( skill ) => {
		
		return (
			<SubskillList handleClick={ props.handleClick } skillObj={ skill } />
		)
	} )

	return (
		<ul className="skills">
			{ unfoldList }
		</ul>
	)
}

class ScrollIcon extends React.Component {
  constructor(props) {
	super(props);
	this.handleEnter = this.handleEnter.bind(this)
	this.handleLeave = this.handleLeave.bind(this)
  }


  handleEnter(e) {
  	const scrollUnfold = document.querySelector(".forum-icon-"+this.props.index)
  	const scrollTitle = document.querySelector(".scrollIcon-"+this.props.index+" .title")
  	const scrollList = document.querySelector(".scrollIcon-"+this.props.index+" .list")
  	const scrollSt2 = document.querySelector(".forum-icon-"+this.props.index+" #unfold .st2")
  	const scrollHeight = 777.5 / scrollUnfold.clientWidth * ( scrollList.clientHeight + scrollTitle.clientHeight*1.8 ) 
  	scrollUnfold.setAttribute("viewBox", "0 0 777.5 " + scrollHeight*1.1)
  	scrollSt2.setAttribute("style", "transform: scaleY("+(scrollHeight / 780)*1.1+")")
  	scrollList.style.width = ((777.5 - 115) / 777.5 * scrollUnfold.clientWidth * 0.85) + "px"
  	if ( this.viewBoxTimer ) {
		clearTimeout(this.viewBoxTimer)
	}
  }

  handleLeave(e) {
  	const scrollUnfold = document.querySelector(".forum-icon-"+this.props.index)
  	if ( this.viewBoxTimer ) {
		clearTimeout(this.viewBoxTimer)
	}
	this.viewBoxTimer = setTimeout( () => {
		scrollUnfold.setAttribute("viewBox", "0 0 777.5 284.1")
	}, 1000 )
  	
  }

  render() {

    return (
      <div onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} className={ "scrollIcon scrollIcon-" + this.props.index } >
      	<div className="title">
      		{ this.props.fieldObj.name }
      	</div>
      	<div className="list">
      		<div>
      			<p>
      				<i className="fa fa-map-signs fa-2x" aria-hidden="true"></i>技能名稱：
      			</p>
      		</div>
      		<ForumList fieldObj={ this.props.fieldObj } handleClick={ this.handleEnter } />
      	</div>
        <Icon className={ "forum-icon forum-icon-" + this.props.index } alt="scroll-icon" />
        
      </div>
    );
  }
}
export default ScrollIcon;
import React from 'react';
import icon from '../scroll_v3_final.svg'
import { ReactComponent as Icon } from '../scroll_v3_final.svg'
import '../Utils/ScrollIcon.css';

function ForumList(props) {
	
	const fields = props.subjectObj.children

	const unfoldList = fields.map( ( field ) => {
		const skillList = field.children.map( ( skill ) => {
			const subskillList = skill.children.map( ( subskill ) =>
				<li>{ subskill.name }</li> 
			)
			return (
				<li>
					{ skill.name }
					<ul className="subskills">
						{ subskillList }
					</ul>
				</li>
			)
		} )
		return (
			<li>
				{ field.name }
				<ul className="skills">
					{ skillList }
				</ul>
			</li>
		)
	} )

	return (
		<ul className="fields">
			{ unfoldList }
		</ul>
	)
}

class ScrollIcon extends React.Component {
  constructor(props) {
	super(props);
  }


  handleEnter() {
  	const scrollUnfold = document.querySelector('.forum-icon')
  	const scrollList = document.querySelector('.scrollIcon .list')
  	scrollUnfold.setAttribute("viewBox", "0 0 777.5 " + scrollList.clientHeight); 
  }

  render() {

    return (
      <div className="scrollIcon">
      	<div className="title">
      		{ this.props.subjectObj.name }
      	</div>
        <Icon onMouseEnter={this.handleEnter} className="forum-icon" alt="scroll-icon" />
        <div className="list">
      		<ForumList subjectObj={ this.props.subjectObj } />
      	</div>
      </div>
    );
  }
}
export default ScrollIcon;
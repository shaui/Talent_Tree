import React, { useState } from 'react';
import { Button, Table, OverlayTrigger, Popover, Badge, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Forum.css';
import FirebaseMg from '../Utils/FirebaseMg.js';
import { CSSTransition } from 'react-transition-group';

import crown from '../crown.png';
import CustomPagination from '../Utils/CustomPagination';

function StdPopover(props) {

  const [show, setShow] = useState(false)

  const showOverlay = () => setShow(true)
  const hideOverlay = () => setShow(false)

  const popoverContent = props.standards.map( (standard) => {

  	const stdWithContext = props.standardsAll.find( ( std ) => 
  		std.name === standard
  	)
  	const contextItems = stdWithContext.context.map( (context) => 
  		<li>
  			{ context }
  		</li>
  	)

  	return (
  		<li>
			<h5 className="forum">
			    <OverlayTrigger
			      placement="bottom-start"
			      overlay={
			        <Tooltip className="tooltip forum">
			          <ol className="contexts forum">
			          	{ contextItems }
			          </ol>
			        </Tooltip>
			      }
			    >
			      <Badge variant="dark">{standard}</Badge>
			    </OverlayTrigger>
			</h5>
		</li>
	)
  } )

  const popover = (
  	<Popover onMouseEnter={showOverlay} onMouseLeave={hideOverlay} id="popover-bottom-start" className="forum">
      <Popover.Title as="h3">子技能學習標準</Popover.Title>
      <Popover.Content>
      	<ol className="forum">
      	  { popoverContent }
      	</ol>
      </Popover.Content>
    </Popover>
  )

  return (
    <OverlayTrigger
    placement="bottom-start"
    overlay={popover}
    show={show} >
      <Button onMouseEnter={showOverlay} onMouseLeave={hideOverlay} variant="dark">
      	<i className="fa fa-tags" aria-hidden="true"></i>
      </Button>
    </OverlayTrigger>
  );
}

function PostLink(props) {
	const name = props.name
	const id = props.id
	const subskill = props.subskill
	const params = []
	params[0] = id
	params[1] = name
	params[2] = subskill

	// 因為this.props.match.url才有之前頁面傳的參數，所以要傳到這裡
	return (
		<Link to={ `${ props.url }/course/${ params }` }> 
			{ name }
		</Link>
	)
}

function PostsTable(props) {
	const posts = props.data ;
	let postItems = [] ; 
	for ( var i in posts ) {
		const timePosted = posts[i].timePosted.split(' ').map( ( timeString ) => 
			<div> { timeString } </div>
		)
		postItems.push(
			<tr className="content table forum">
			  { 
			  	posts[i].isOfficial ? 
			  	<td className="isOfficial">
			  		<img src={ crown } alt="official" className="crown" />
			  	</td> :
			  	<td className="isOfficial"></td>
			  }
			  <td className="standards">
			  	<StdPopover standards={posts[i].course.standards} standardsAll={ props.standards } />
			  </td>
	          <th className="type" scope="row">{posts[i].type}</th>
	          <td className="name">
	          	<PostLink 
	          	url={ props.url }
	          	name={ posts[i].name } 
	          	id={ i }
	          	subskill={props.subskill} />
	          </td>
	          <td className="user">{ posts[i].user }</td>
	          <td className="comments">{ posts[i].course.comments ? posts[i].course.comments.length : 0 } / { posts[i].view }</td>
	          <td className="like">{ posts[i].like } / { posts[i].dislike }</td>
	          <td className="time">
	          	<div className="forum">
	          		{ timePosted }
	          	</div>
	          </td>
	        </tr>
		)
	}
	// const postItems = posts.map( (post) =>
	// 	<tr>
 //          <th scope="row">{post.type}</th>
 //          <td>
 //          	<PostLink name={post.name} />
 //          </td>
 //          <td>{post.user}</td>
 //          <td>{post.commentsNum}/{post.view}</td>
 //          <td>{post.PstCommentsNum}/{post.NgtCommentsNum}</td>
 //          <td>{post.timePosted}</td>
 //        </tr>
	// ) ;
	return (
		<Table hover responsive>
	      <thead className="forum">
	        <tr>
	          <th>官方認證</th>
	          <th>學習標準</th>
	          <th>資源分類</th>
	          <th className="name">資源名稱</th>
	          <th>發布者</th>
	          <th>
	          	<i className="fa fa-commenting" aria-hidden="true"></i> / <i className="fa fa-eye" aria-hidden="true"></i>
	          </th>
	          <th>
	          	<i className="fa fa-thumbs-o-up" aria-hidden="true"></i> / <i className="fa fa-thumbs-o-down" aria-hidden="true"></i>
	          </th>
	          <th>發布時間</th>
	        </tr>
	      </thead>
	      <tbody className="forum">
	        { postItems }
	      </tbody>
	    </Table>
	);
}

class PostsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			pathObj: {},
			standards: [],
			isLoading: true
		} ;
	}

	getPosts(pathObj) {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = "Posts/" + pathObj.subskill ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;
			
			this.setState( {
				data: data.children,
				pathObj: pathObj,
				standards: data.path.standards,
				isLoading: false
			} ) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}
	
	componentDidMount() {
		const sentPath = this.props.match.params.path
		const pathArr = sentPath.split(',')
		let pathObj = {}
		if ( pathArr.length === 5 ) {
			pathObj.subskill = pathArr[1]
			pathObj.skill = pathArr[2]
			pathObj.field = pathArr[3]
			pathObj.subject = pathArr[4]
			this.getPosts(pathObj)
		}
		else if ( pathArr.length === 4 ) {
			pathObj.subskill = pathArr[0]
			pathObj.skill = pathArr[1]
			pathObj.field = pathArr[2]
			pathObj.subject = pathArr[3]
			this.getPosts(pathObj)
		}
		else {
			pathObj.subskill = pathArr[0]
			const fbMg = new FirebaseMg() ;
			var root = fbMg.myRef ;
			var path = 'Trees/' ;
			var myRef = root.child(path) ;
			myRef.once('value').then( (snapshot) => {
				let treeData = snapshot.val() ;
				var traverse = require('traverse') ;
				
				traverse(treeData).forEach(function (x) {
				    if (x === pathArr[0]) {
				    	console.log(this.parent.parent.parent.node.name);
				    	pathObj.skill = this.parent.parent.parent.node.name
				    	pathObj.field = this.parent.parent.parent.parent.parent.node.name
				    	pathObj.subject = this.parent.parent.parent.parent.parent.parent.parent.node.name
				    }
				});

				this.getPosts(pathObj)
				
			} )
			.catch( (error) => {
				console.log(error) ;
			} ) ;
		}
		
	}

	render() {
		
		const pathObj = this.state.pathObj
		let pathArr = []
		for ( var i in pathObj ) {
			pathArr.push( pathObj[i] )
		}

		return (
			<div className="content" style={{ 'marginTop': '10vh' }}>
				<div className="container banner-container">
					<div className="row"></div>
				</div>


				<div className="container">
					<div className="row justify-content-between">
						<div className="col-4">
							<Link to={ `/forum/${ pathArr }/post` }> 
								<button className="post-btn">
									發布文章
								</button>
							</Link>
						</div>
						<div className="col-6 forum">
							{   
								this.state.data ?
									<CustomPagination posts={this.state.data} />
								:
									""
							}
						</div>
					</div>
				</div>
				<CSSTransition in={!this.state.isLoading} timeout={1200} classNames="content" unmountOnExit appear>
					<div className="container forum">
						<div className="row">
							<div className="col">
								<PostsTable 
								url={this.props.match.url}
								data={this.state.data} 
								subskill={this.state.pathObj.subskill}
								standards={this.state.standards} />
							</div>
						</div>
					</div>
					</CSSTransition>
				<CSSTransition in={!this.state.isLoading} timeout={1200} classNames="content" unmountOnExit appear>
					<div className="container forum">
						<div className="row justify-content-end">
							<div className="col-6 forum">
							{   
								this.state.data ?
									<CustomPagination posts={this.state.data} />
								:
									""
							}
							</div>
						</div>
					</div>
				</CSSTransition>
			</div>
		);
	}
}

export default PostsPage;
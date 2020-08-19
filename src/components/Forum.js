import React, { useState } from 'react';
import { Button, Table, OverlayTrigger, Popover, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Forum.css';
import FirebaseMg from '../Utils/FirebaseMg.js';
import { CSSTransition } from 'react-transition-group';

import CustomPagination from '../Utils/CustomPagination';

function StdPopover(props) {

  const [show, setShow] = useState(false)

  const showOverlay = () => setShow(true)
  const hideOverlay = () => setShow(false)

  const popover = (
  	<Popover onMouseEnter={showOverlay} onMouseLeave={hideOverlay} id="popover-bottom-start" className="forum">
      <Popover.Title as="h3">子技能學習標準</Popover.Title>
      <Popover.Content>
      	<ol className="forum">
      	  {
        	props.standards.map( (standard) => 
        		<li>
        			<h5 className="forum">
        				<Badge variant="dark">{standard}</Badge>
        			</h5>
        		</li>
        	)
          }
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
	return (
		<Link to={ `${props.url}/course/${ id }&${ name }&${ subskill }` }> 
			{ name }
		</Link>
	)
}

function PostsTable(props) {
	const posts = props.data ;
	let postItems = [] ; 
	for ( var i in posts ) {
		postItems.push(
			<tr>
			  <td>
			  	<StdPopover standards={posts[i].course.standards} />
			  </td>
	          <th scope="row">{posts[i].type}</th>
	          <td>
	          	<PostLink 
	          	url={props.url}
	          	name={posts[i].name} 
	          	id={i}
	          	subskill={props.subskill} />
	          </td>
	          <td>{posts[i].user}</td>
	          <td>{posts[i].course.comments ? posts[i].course.comments.length : 0} / {posts[i].view}</td>
	          <td>{posts[i].like} / {posts[i].dislike}</td>
	          <td>{posts[i].timePosted}</td>
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
	          <th>學習標準</th>
	          <th>資源分類</th>
	          <th>資源名稱</th>
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
	        {postItems}
	      </tbody>
	    </Table>
	);
}

class PostsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			pathObj: new Object(),
			isLoading: true
		} ;
	}

	getPosts(pathObj) {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Posts/' + pathObj.subskill + "/children" ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;
			this.setState( {
				data: data,
				pathObj: pathObj,
				isLoading: false
			} ) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}
	
	componentDidMount() {
		const sentPath = this.props.match.params
		let pathObj = new Object()
		if ( !sentPath.length ) {
			pathObj.subject = "資管系"
			pathObj.field = "系統規劃"
			pathObj.skill = "JAVA"
			pathObj.subskill = "JAVA 1級"
			this.getPosts(pathObj)
		}
		else if ( Array.isArray(sentPath.path) ) {
			const pathArray = sentPath.path
			if ( sentPath.path.length === 4 ) {
				pathObj.subject = pathArray[3]
				pathObj.field = pathArray[2]
				pathObj.skill = pathArray[1]
				pathObj.subskill = pathArray[0]
			}
			else {
				pathObj.subject = pathArray[4]
				pathObj.field = pathArray[3]
				pathObj.skill = pathArray[2]
				pathObj.subskill = pathArray[1]
				pathObj.standard = pathArray[0]
			}
			this.getPosts(pathObj)
		} 
		else {
			if ( typeof sentPath.path === "string" )	{
				const pathString = sentPath.path
				pathObj.subskill = pathString
				const fbMg = new FirebaseMg() ;
				var root = fbMg.myRef.child('Trees') ;
				var path = 'Trees' ;
				var myRef = root.child(path) ;
				myRef.once('value').then( (snapshot) => {
					let treeData = snapshot.val() ;
					var traverse = require('traverse') ;
					
					traverse(treeData).forEach(function (x) {
					    if (x === pathString) {
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
		
	}

	render() {
		console.log(this.props);
		return (
			<div className="content" style={{ 'marginTop': '10vh' }}>
				<div className="container banner-container">
					<div className="row"></div>
				</div>


				<div className="container">
					<div className="row justify-content-between">
						<div className="col-4">
							<Link to={ `${ this.props.match.url }/post` }> 
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
								subskill={this.state.pathObj.subskill} />
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
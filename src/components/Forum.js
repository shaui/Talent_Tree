import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Forum.css';
import FirebaseMg from '../Utils/FirebaseMg.js';
import { CSSTransition } from 'react-transition-group';

import CustomPagination from '../Utils/CustomPagination';

function PostLink(props) {
	const name = props.name
	const id = props.id
	const subskill = props.subskill
	console.log(props);
	return (
		<Link to={{
		     pathname:'/forum/course',
		     state: {
		     	id: id,
		     	name: name,
		     	level: subskill 
		     }
		}}> 
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
	          <th scope="row">{posts[i].type}</th>
	          <td>
	          	<PostLink 
	          	name={posts[i].name} 
	          	id={i}
	          	subskill={props.subskill} />
	          </td>
	          <td>{posts[i].user}</td>
	          <td>{posts[i].course.comments ? posts[i].course.comments.length : 0}/{posts[i].view}</td>
	          <td>{posts[i].like}/{posts[i].dislike}</td>
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
	      <thead>
	        <tr>
	          <th>資源分類</th>
	          <th>資源名稱</th>
	          <th>發布者</th>
	          <th>
	          	<i className="fa fa-commenting" aria-hidden="true"></i>/<i className="fa fa-eye" aria-hidden="true"></i>
	          </th>
	          <th>
	          	<i className="fa fa-thumbs-o-up" aria-hidden="true"></i>/<i className="fa fa-thumbs-o-down" aria-hidden="true"></i>
	          </th>
	          <th>發布時間</th>
	        </tr>
	      </thead>
	      <tbody>
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
		var path = 'Posts/' + pathObj.subskill ;
		var myRef = root.child(path) ;
		console.log("Path Obj:", pathObj)
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
		const pathName = this.props.location.pathname
		console.log( pathName.split("/") );
		console.log("###",this.props.location.state, this.props.location.state["path"]) //可以觀看傳遞的參數
		const sentPath = this.props.location.state["path"]
		let pathObj = new Object()
		if ( Array.isArray(sentPath) ) {
			if ( sentPath.length === 4 ) {
				pathObj.subject = sentPath[3]
				pathObj.field = sentPath[2]
				pathObj.skill = sentPath[1]
				pathObj.subskill = sentPath[0]
			}
			else {
				pathObj.subject = sentPath[4]
				pathObj.field = sentPath[3]
				pathObj.skill = sentPath[2]
				pathObj.subskill = sentPath[1]
				pathObj.standard = sentPath[0]
			}
			this.getPosts(pathObj)
		} 
		else {
			if ( typeof sentPath === "string" )	{
				pathObj.subskill = sentPath
				const fbMg = new FirebaseMg() ;
				var root = fbMg.myRef.child('Trees') ;
				var path = 'Trees' ;
				var myRef = root.child(path) ;
				myRef.once('value').then( (snapshot) => {
					let treeData = snapshot.val() ;
					var traverse = require('traverse') ;
					
					traverse(treeData).forEach(function (x) {
					    if (x === sentPath) {
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
			else {
				pathObj.subject = "資管系"
				pathObj.field = "系統規劃"
				pathObj.skill = "JAVA"
				pathObj.subskill = "JAVA 1級"
				this.getPosts(pathObj)
			}
		}
		
	}

	render() {
		console.log("CustomPagination:", this.state.data)
		return (
			<div className="content" style={{ 'marginTop': '10vh' }}>
				<div className="container banner-container">
					<div className="row"></div>
				</div>


				<div className="container">
					<div className="row justify-content-between">
						<div className="col-4">
							<Link to={{
							     pathname:'/forum/post',
							     state: {
							     	subject: "test",
							     	field: "test",
							     	skill: "test",
							     	subskill: "test",
							     	standards: ["test XXX", "test AAA", "test BBB", "test CCC"] }
							}}> 
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
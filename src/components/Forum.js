import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Forum.css';
import FirebaseMg from '../Utils/FirebaseMg.js';

import CustomPagination from '../Utils/CustomPagination';

function PostLink(props) {
	const name = props.name
	const id = props.id
	console.log(id);
	return (
		<Link to={{
		     pathname:'/course',
		     state: {courseID: id}
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
	          	<PostLink name={posts[i].name} id={i} />
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
		this.state = {data: []} ;
	}
	
	componentDidMount() {
		console.log("###",this.props.location.state) //可以觀看傳遞的參數
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Posts/JAVA 1級' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;
			this.setState( {
				data
			} ) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}

	render() {
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
						<div className="col-6">
							<CustomPagination posts={this.state.data} />
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col">
							<PostsTable data={this.state.data} />
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-6 align-self-end">
							<CustomPagination posts={this.state.data} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PostsPage;
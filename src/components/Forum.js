import React from 'react';
import { Table } from 'react-bootstrap';
import './Forum.css';
import FirebaseMg from '../Utils/FirebaseMg.js'

function PostsTable(props) {
	const posts = props.data ;
	const postItems = posts.map( (post) =>
		<tr>
          <th scope="row">{post.type}</th>
          <td>
          	<a href="#">{post.name}</a>
          </td>
          <td>{post.user}</td>
          <td>{post.commentsNum}/{post.view}</td>
          <td>{post.PstCommentsNum}/{post.NgtCommentsNum}</td>
          <td>{post.timePosted}</td>
        </tr>
	) ;
	return (
		<Table hover responsive>
	      <thead>
	        <tr>
	          <th>資源分類</th>
	          <th>資源名稱</th>
	          <th>發布者</th>
	          <th>回復/觀看</th>
	          <th>好評/負評</th>
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
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Posts' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;
			console.log("data :",data)
			this.setState({data}) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
		console.log(this.props);
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
							<button id="post-btn" className="primary">
								發布文章
							</button>
						</div>
						<div className="col-6">
							{/* <Pagination /> */}
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
							{/* <Pagination /> */}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PostsPage;
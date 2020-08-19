import React, { useState } from 'react';
import { Button, Table, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ForumHome.css';
import FirebaseMg from '../Utils/FirebaseMg.js';
import { CSSTransition } from 'react-transition-group';

function ControlledCarousel(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const items = props.posts.map( () => 
  	<Carousel.Item>
        <PostsTable />
    </Carousel.Item>
  )

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      { items }
    </Carousel>
  );
}

function PostsCard(props) {
	
	let posts = [] ;
	for ( var i in props.posts ) {
		posts.push( props.posts[i] )
	}

	var filterByTime = ( posts ) => {
		posts = posts.map( ( subskill ) =>
			subskill.children.filter( ( post ) => {
				const timePosted = new Date(post.timePosted)
				let now = new Date()
				now.setMonth( now.getMonth()-1 )
				return timePosted.getTime() >= now.getTime()
			} )
		)
		return posts
	} 
	posts = filterByTime( props.posts )
	
	// arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)
	var groupBy = (originArr, key) => 
	    originArr.reduce( (accuObj, post) => {
	      ( accuObj[ post.path[key] ] = accuObj[ post.path[key] ] || [] ).push( post )
	      return accuObj
	    }, {} )  // 這個空物件為accumulator的初始值


	const postsObj = groupBy( posts, "subject" )

	return (
		<Card>
		  <Card.Header>Featured</Card.Header>
		  <Card.Body>
		    <ControlledCarousel posts={props.posts} />
		  </Card.Body>
		</Card>
	)
}

function PostLink(props) {
	const name = props.name
	const id = props.id
	const subskill = props.subskill
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
	          	<i className="fa fa-commenting" aria-hidden="true"></i> / <i className="fa fa-eye" aria-hidden="true"></i>
	          </th>
	          <th>
	          	<i className="fa fa-thumbs-o-up" aria-hidden="true"></i> / <i className="fa fa-thumbs-o-down" aria-hidden="true"></i>
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

class ForumHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			pathObj: new Object(),
			isLoading: true
		} ;
	}

	getPosts() {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Posts/' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;
			this.setState( {
				data: data,
				isLoading: false
			} ) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}
	
	componentDidMount() {
		this.getPosts()
	}

	render() {
		return (
			<div className="content" style={{ 'marginTop': '10vh' }}>
				<div className="container banner-container">
					<div className="row"></div>
				</div>


				<div className="container">
					<CSSTransition in={!this.state.isLoading} timeout={1200} classNames="content" unmountOnExit appear>
						<div className="row justify-content-between">
							<div className="col-4">
								<PostsCard posts={this.state.data} />
							</div>
						</div>
					</CSSTransition>
				</div>
			</div>
		);
	}
}

export default ForumHome;
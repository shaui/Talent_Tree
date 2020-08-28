import React, { useState } from 'react';
import { Table, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ForumHome.css';
import FirebaseMg from '../Utils/FirebaseMg.js';
import { CSSTransition } from 'react-transition-group';

import ScrollIcon from '../Utils/ScrollIcon.js';

function PostsCarousel(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex) ;
    props.handleSelect( selectedIndex, e ) ;
  }
	
  const postsObj = props.postsObj

  let items = [] ;
  for ( var subject in postsObj ) {
  	
  	items.push( 
  		<Carousel.Item>
        	<PostsTable type={ props.type } posts={ postsObj[subject] } />
    	</Carousel.Item>
    )
  }

  return (
    <Carousel 
    className="forumHome"
    indicators={false}
    prevIcon={<span><i className="fa fa-caret-square-o-left fa-lg" aria-hidden="true"></i></span>}
    nextIcon={<span><i className="fa fa-caret-square-o-right fa-lg" aria-hidden="true"></i></span>}
    activeIndex={index} 
    onSelect={handleSelect}>
      { items }
    </Carousel>
  )
}

function ScrollCarousel(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex) ;
  }
	
  const treeObj = props.treeObj
  let treeArr = []
  for ( var subject in treeObj ) {
	  treeArr.push( treeObj[subject] )
  }

  const items = treeArr.map( ( subjectObj ) => {
  	const scrollItems = subjectObj.children.map( ( fieldObj, idx ) => 
  		<div className="col col-md-6 col-12">
    		<ScrollIcon fieldObj={ fieldObj } index={ idx } />
        </div>
    )
  	return (
  		<Carousel.Item className="container">
  			<div className="title">
  				<h4>
  					{ subjectObj.name }
  				</h4>
  			</div>
  			<div className="row justify-content-center">
  				{ scrollItems }
  			</div>
	    </Carousel.Item>
    )
  } )

  return (
    <Carousel 
    className="forumHome"
    indicators={false}
    prevIcon={<span><i className="fa fa-caret-square-o-left fa-lg" aria-hidden="true"></i></span>}
    nextIcon={<span><i className="fa fa-caret-square-o-right fa-lg" aria-hidden="true"></i></span>}
    activeIndex={index} 
    onSelect={handleSelect}>
      { items }
    </Carousel>
  )
}

function PostsCard(props) {
	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex, e) => {
	  	setIndex(selectedIndex) ;
	}

	let title = "" ;
	const type = props.type
	if ( type === "timePosted" ) {
		title = "本月最新"
	}
	else if ( type === "view" ) {
		title = "本月熱門"
	}
	else if ( type === "like" ) {
		title = "本月熱門"
	}

	const postsObj = props.postsObj

	const subjects = [] ;
	for ( var subject in postsObj ) {
		subjects.push( subject )	
	}

	return (
		<div>
			<div id="header" className="forum">
				<h5>
					{ title }
				</h5>
			</div>
			<Card>
			  <Card.Header>{ subjects[index] }</Card.Header>
			  <Card.Body>
			    <PostsCarousel 
			    type={ type }
			    postsObj={ postsObj }
			    handleSelect={ handleSelect } />
			  </Card.Body>
			</Card>
		</div>
	)
}

function PostLink(props) {
	const name = props.name
	const id = props.id
	const subskill = props.subskill
	const pathObj = props.path
	let pathArr = []
	pathArr[0] = subskill
	for ( var key in pathObj ) {
		if ( key === "subject" )
			pathArr[3] = pathObj[key]
		else if ( key === "field" )
			pathArr[2] = pathObj[key]
		else if ( key === "skill" )
			pathArr[1] = pathObj[key]
	}
	const params = []
	params[0] = id
	params[1] = name
	params[2] = subskill
	return (
		<Link to={ `/forum/${ pathArr }/course/${ params }` }> 
			{ name }
		</Link>
	)
}

function PostsTable(props) {
	let postsArr = [] ;
	props.posts.forEach( ( postObj ) => {
		for ( var i in postObj.children ) {
			postObj.children[i].id = i
			postsArr.push( postObj.children[i] )
			postObj.children[i].path = postObj.path
		}
	} ) ;
	
	if ( props.type === "timePosted" ) {
		postsArr = postsArr.sort( (a, b) => {
			const timePostedA = new Date( a.timePosted )
			const timePostedB = new Date( b.timePosted )
			return timePostedA > timePostedB ? 1 : -1
		} )
	}
	else if ( props.type === "view" ) {
		postsArr = postsArr.sort( (a, b) => 
			a.view > b.view ? 1 : -1
		)
	}
	else {
		postsArr = postsArr.sort( (a, b) =>
			a.like > b.like ? 1 : -1
		)
	}

	postsArr = postsArr.splice(0, 10)
	
	let postItems = [] ; 
	for ( var i in postsArr ) {
		postItems.push(
			<tr>
	          <th scope="row">{ postsArr[i].subskill }</th>
	          <td>
	          	<PostLink 
	          	path={ postsArr[i].path }
	          	name={ postsArr[i].name } 
	          	id={ postsArr[i].id }
	          	subskill={ postsArr[i].subskill } />
	          </td>
	          <td>{ postsArr[i].user }</td>
	          <td>{ postsArr[i].timePosted }</td>
	        </tr>
		)
	}
	return (
		<Table hover responsive>
	      <thead>
	        <tr>
	          <th>子技能名稱</th>
	          <th>資源名稱</th>
	          <th>發布者</th>
	          <th>發布時間</th>
	        </tr>
	      </thead>
	      <tbody>
	        { postItems }
	      </tbody>
	    </Table>
	);
}

class ForumHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: null,
			pathObj: {},
			isLoading: true
		} ;
	}

	getPosts() {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Posts/' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {

			// 把當作key的子技能名稱放進每則貼文中，這樣才能比較不同子技能之間的貼文後把子技能名稱標示出來
			let postsObj = snapshot.val() ;
			let posts = [] ;
			for ( var subskill in postsObj ) {
				for ( var i in postsObj[subskill].children ) {
					postsObj[subskill].children[i].subskill = subskill
				}
				posts.push( postsObj[subskill] )
			}
			
			// 根據時間過濾貼文
			var filterByTime = ( posts ) => {
				posts.forEach( ( subskill ) => {
					for ( var i in subskill.children ) {
						const timePosted = new Date( subskill.children[i].timePosted )
						let now = new Date()
						// 只抓取一個月內的貼文
						now.setMonth( now.getMonth()-1 )
						if ( timePosted.getTime() < now.getTime() )
							delete subskill.children[i]
					}
				} )
				return posts
			} 
			posts = filterByTime( posts )
			
			// 依照科系分類貼文
			// arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)
			var groupBy = (originArr, key) => 
			    originArr.reduce( (accuObj, post) => {
			      ( accuObj[ post.path[key] ] = accuObj[ post.path[key] ] || [] ).push( post )
			      return accuObj
			    }, {} )  // 這個空物件為accumulator的初始值

			let postsObjClassified = groupBy( posts, "subject" )

			// 全部科系以外增加一個全科系的選項
		    let allPosts = []
		    for ( var subject in postsObjClassified ) {
		  	  allPosts.push( postsObjClassified[subject] )
		    }
		    postsObjClassified["全科系"] = allPosts.flat()

			this.setState( {
				posts: postsObjClassified
			} ) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}
	getTree() {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Trees/' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {

			let treeObj = snapshot.val() ;

			this.setState( {
				treeObj: treeObj,
				isLoading: false
			} ) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}
	
	componentDidMount() {
		this.getPosts()
		this.getTree()
	}

	render() {

		return (
			<div className="content" style={{ 'marginTop': '10vh' }}>
				<div className="container banner-container">
					<div className="row"></div>
				</div>

				<CSSTransition in={!this.state.isLoading} timeout={1200} classNames="content" unmountOnExit appear>
					<div className="container forumHome">
						<div className="row">
							<div className="col">
								<h3>近期貼文</h3>
							</div>
						</div>
						<div className="row justify-content-between">
							<div className="col col-md-6 col-12 announce">
								<PostsCard 
								postsObj={this.state.posts}
								type="timePosted" />
							</div>
							<div className="col col-md-6 col-12 announce">
								<PostsCard 
								postsObj={this.state.posts}
								type="view" />
							</div>
						</div>
						<div className="row">
							<div className="col">
								<h3>快速前往</h3>
							</div>
						</div>
						<div className="row justify-content-center">
							<div className="col col-10">
								<ScrollCarousel treeObj={this.state.treeObj} />
							</div>
							
						</div>
					</div>
				</CSSTransition>
			</div>
		);
	}
}

export default ForumHome;
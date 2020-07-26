import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FirebaseMg from '../Utils/FirebaseMg.js'
import './PostingPage.css';

function _uuid() {
  var d = Date.now();
  if ( typeof performance !== 'undefined' && typeof performance.now === 'function' ){
  	d += performance.now(); 
  	//use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  	var r = (d + Math.random() * 16) % 16 | 0 ;
    d = Math.floor(d / 16) ;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) ;
  });
}

class PostingForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			subjects: [], 
			fields: [
				{
					children: [],
					name: "--請選擇科系--"
				}
			],
			skills: [
				{
					children: [],
					name: "--請選擇領域--"
				}
			],
			subskills: [
				{
					children: [],
					name: "--請選擇技能--"
				}
			],
		} ;
		this.chooseSubject = this.chooseSubject.bind(this) ;
		this.chooseField = this.chooseField.bind(this) ;
		this.chooseSkill = this.chooseSkill.bind(this) ;
		this.handleSubmit = this.handleSubmit.bind(this) ;
	}
	
	componentDidMount() {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Trees' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;
			// let fields = [] ;
			// let skills = [] ;
			// let subSkills = [] ;

			// data.forEach(function(index, subject) {

			// 	return subject;
			// })

			// data["資管系"]["children"].forEach( (field) => {
			// 	fields.push( field.name ) ;
			// 	console.log(field);
			// 	field["children"].forEach( (skill) => {
			// 		skills.push( skill.name ) ;
			// 		skill["children"].forEach( (subSkill) => {
			// 			console.log(subSkill);
			// 			subSkills.push( subSkill.name ) ;
			// 		} ) ;
			// 	} ) ;
			// } ) ;

			// let level_2 = data["資管系"].children
			// for (var index_2 in level_2) {
			// 	fields.push( level_2[index_2]["name"] ) ;
			// 	let level_3 = level_2[index_2]["children"]
			// 	for (var index_3 in level_3) {
			// 		skills.push( level_3[index_3]["name"] ) ;
			// 		let level_4 = level_3[index_3]["children"]
			// 		for (var index_4 in level_4) {
			// 			subSkills.push( level_4[index_4]["name"] ) ;
			// 		}
			// 	}
			// }

			this.setState( { 
				data: data,
				subjects: data["資管系"]
			} )
			
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}

	chooseSubject(e) {
		
		let data = this.state.data
		let fields = data[e.target.value]["children"]
		this.setState( {
			fields: fields
		} )
	}
	chooseField(e) {
		
		let fields = this.state.fields
		let field = fields.find( (node) => {
			return node.name === e.target.value
		} )
		let skills = field.children
		this.setState( {
			skills: skills
		} )
	}
	chooseSkill(e) {
		
		let skills = this.state.skills
		let skill = skills.find( (node) => {
			return node.name === e.target.value
		} )
		let subskills = skill.children
		this.setState( {
			subskills: subskills
		} )
	}
	handleSubmit(e) {
		const elems = e.target.elements
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Posts/'+ _uuid() ;
		var myRef = root.child(path) ;
		myRef.set( {
			user: "Louis",
			name: elems.postTitle.value,
			type: elems.courseType.value,
			course: {
				intro: elems.courseIntro.value,
				links: [
					{
						url: elems.courseURL.value
					}
				]
			},
			like: 0,
			dislike: 0,
			view: 0,
			timePosted: new Date().toLocaleString()
		} )
	}

	render ( ) {
		const data = this.props.data
		const hasDefault = Boolean( data )
		let subjectInput ;
		let fieldInput ;
		let skillInput ;
		let subskillInput ;
		if ( hasDefault ) {
			subjectInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subject">
			        <Form.Label>科系名稱</Form.Label>
			        <Form.Control
			          name="subject" 
			          as="select"
			          disabled
			          required>
			          <option>{data.subject}</option>
			          <option>資管系</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			fieldInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="field">
			        <Form.Label>領域名稱</Form.Label>
			        <Form.Control
			          name="field" 
			          as="select" 
			          disabled
			          required>
			          <option>{data.field}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			skillInput = 
				<Col md={{ span: 2, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="skill">
			        <Form.Label>技能名稱</Form.Label>
			        <Form.Control
			          name="skill" 
			          as="select" 
			          disabled
			          required>
			          <option>{data.skill}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			subskillInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subskill">
			        <Form.Label>技能名稱</Form.Label>
			        <Form.Control
			          name="subskill" 
			          as="select" 
			          disabled
			          required>
			          <option>{data.subskill}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
		}
		else {
			subjectInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subject">
			        <Form.Label>科系名稱</Form.Label>
			        <Form.Control
			          name="subject" 
			          as="select" 
			          onChange={this.chooseSubject}
			          required>
			          <option>{this.state.subjects.name}</option>
			          <option>資管系</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
						  	
			fieldInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="field">
			        <Form.Label>領域名稱</Form.Label>
			        <Form.Control
			          name="field" 
			          as="select" 
			          onChange={this.chooseField}
			          required>
			          {
			          	this.state.fields.map( (field) => 
							<option>{field.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			skillInput = 
				<Col md={{ span: 2, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="skill">
			        <Form.Label>技能名稱</Form.Label>
			        <Form.Control
			          name="skill" 
			          as="select" 
			          onChange={this.chooseSkill}
			          required>
			          {
			          	this.state.skills.map( (skill) => 
							<option>{skill.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			subskillInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subskill">
			        <Form.Label>子技能名稱</Form.Label>
			        <Form.Control
			          name="subskill" 
			          as="select" 
			          required>
			          {
			          	this.state.subskills.map( (subskill) => 
							<option>{subskill.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
		}

		return (
			<div className="content" style={{ 'marginTop': '12vh' }}>
				<div className="container form-container">
					<Form onSubmit={this.handleSubmit}>
					  <Form.Row>
					  	<Col md={{ span: 6, offset: 1 }} xs ={12}>
					  	  <Form.Group controlId="postTitle">
					        <Form.Label>標題</Form.Label>
					        <Form.Control
					          name="postTitle" 
					          type="text" 
					          placeholder="請輸入標題" 
					          required />
					      </Form.Group>
					  	</Col>
					  	{ subjectInput }
					  	{ fieldInput }
					  </Form.Row>

					  <Form.Row>
					    { skillInput }
					  	{ subskillInput }
					  </Form.Row>
						
					  <Form.Row>
					  	<Col md={{ span: 8, offset: 1 }}>
					  	  <Form.Group controlId="courseURL">
					        <Form.Label>課程網址</Form.Label>
					        <Form.Control
					          name="courseURL" placeholder="請輸入網址" required />
					      </Form.Group>
					  	</Col>
					  	<Col md={2}>
					  	  <Form.Group controlId="courseType">
					        <Form.Label>課程分類</Form.Label>
					        <Form.Control
					          name="courseType" as="select" required>
					          <option>平台課程</option>
					          <option>心得筆記</option>
					          <option>音訊影片</option>
					        </Form.Control>
					       </Form.Group>
					  	</Col>
					  </Form.Row>

					  <Form.Row>
					    <Col md={{ span: 10, offset: 1 }}>
					      <Form.Group controlId="courseIntro">
					        <Form.Label>課程簡介</Form.Label>
					        <Form.Control
					          name="courseIntro" as="textarea" rows="6" placeholder="請輸入簡介，限200字內。" required />
					      </Form.Group>
					    </Col>
					  </Form.Row>

					  <div className="container">
					  	<div className="row justify-content-end">
					  	  <div className="col-md-4 button-col">
					  	  	<button id="post-btn" className="primary" type="submit">
						  	  	<Link 
						  	  	to={{ pathname:'/forum' }} >
									發布文章
								</Link>
							</button>
					  		
					  	  </div>
					  	  <div className="col-md-1">
					  	  </div>
					    </div>
					  </div>
					  
					</Form>
				</div>
			</div>
		);
	}
}

class PostingPage extends React.Component {

	render() {
		return (
			<PostingForm data={ this.props.location.state } />
		);
	}
}

export default PostingPage;
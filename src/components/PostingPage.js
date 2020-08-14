import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { withRouter } from "react-router-dom"
import FirebaseMg from '../Utils/FirebaseMg.js'
import './PostingPage.css';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

let editor ;

class PostingPage extends React.Component {
	constructor(props) {
		super(props);
		if ( this.props.location.state ) 
			this.props.location.state.standards = []
		this.state = {
			data: [],
			subjects: [
				{
					children: [],
					name: ""
				}
			], 
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
			standards: [
				{
					name: ""
				}
			],
			showStandards: false,
			showStdHelp: false,
			showTextAreaHelp: false,
			defaultData: this.props.location.state,
			courseNum: 1
		} ;
		this.chooseSubject = this.chooseSubject.bind(this) ;
		this.chooseField = this.chooseField.bind(this) ;
		this.chooseSkill = this.chooseSkill.bind(this) ;
		this.chooseSubskill = this.chooseSubskill.bind(this) ;
		this.handleSubmit = this.handleSubmit.bind(this) ;
		this.chooseStandard = this.chooseStandard.bind(this) ;
		this.clickUrlIncrease = this.clickUrlIncrease.bind(this) ;
		this.clickUrlDecrease = this.clickUrlDecrease.bind(this) ;
	}
	
	componentDidMount() {
		let defaultData = this.state.defaultData
		if ( !defaultData ) {
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
				
				let subjects = [
					{
						children: [],
						name: ""
					}
				] ;
				for ( var i in data ) {
					subjects.push( data[i] )
				}
				
				this.setState( { 
					data: data,
					subjects: subjects
				} )
				
			} )
			.catch( (error) => {
				console.log(error) ;
			} ) ;
		}
		else {
			const fbMg = new FirebaseMg() ;
			var root = fbMg.myRef ;
			var path = 'Trees' ;
			var myRef = root.child(path) ;
			myRef.once('value').then( (snapshot) => {
				let data = snapshot.val() ;
				
				const field = data[defaultData.subject].children.find( (field) =>
					field.name === defaultData.field
				);

				const skill = field.children.find( (skill) =>
					skill.name === defaultData.skill
				);

				const subskill = skill.children.find( (subskill) =>
					subskill.name === defaultData.subskill
				);

				const standards = subskill.children

				defaultData.standards = standards
				
				this.setState( { 
					defaultData: defaultData
				} )
				
			} )
			.catch( (error) => {
				console.log(error) ;
			} ) ;
		}
		
	}

	chooseSubject(e) {
		
		let data = this.state.data
		let fields ;

		fields = [
			{
				children: [],
				name: ""
			}
		]

		fields = fields.concat( data[e.target.value]["children"] )
		
		this.setState( {
			fields: fields,
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
			standards: [
				{
					name: ""
				}
			],
			showStandards: false
		} )

		const subjects = this.state.subjects
		if ( subjects[0].name === "" ) {
			let newSubjects = subjects.filter( (subject) =>
				  subject.name !== ""
			)
			this.setState( {
				subjects: newSubjects
			} )
		}
	}
	chooseField(e) {
		
		let fields = this.state.fields
		let initialSkills ;
		let field = fields.find( (node) => {
			return node.name === e.target.value
		} )
		const skills = field.children

		initialSkills = [
			{
				children: [],
				name: ""
			}
		]

		initialSkills = initialSkills.concat( skills )
		this.setState( {
			skills: initialSkills,
			subskills: [
				{
					children: [],
					name: "--請選擇技能--"
				}
			],
			standards: [
				{
					name: ""
				}
			],
			showStandards: false
		} )
		
		if ( fields[0].name === "" ) {
			let newFields = fields.filter( (field) =>
				  field.name !== ""
			)
			this.setState( {
				fields: newFields
			} )
			e.target.selectedIndex -= 1
		}
	}
	chooseSkill(e) {
		
		let skills = this.state.skills
		let initialSubskills ;
		let skill = skills.find( (node) => {
			return node.name === e.target.value
		} )
		let subskills = skill.children

		initialSubskills = [
			{
				children: [],
				name: ""
			}
		]

		initialSubskills = initialSubskills.concat( subskills )
		this.setState( {
			subskills: initialSubskills,
			standards: [
				{
					name: ""
				}
			],
			showStandards: false
		} )

		if ( skills[0].name === "" ) {
			let newSkills = skills.filter( (skill) =>
				  skill.name !== ""
			)
			this.setState( {
				skills: newSkills
			} )
			e.target.selectedIndex -= 1
		}
	}
	chooseSubskill(e) {
		
		let subskills = this.state.subskills
		let subskill = subskills.find( (node) => {
			return node.name === e.target.value
		} )
		let standards = subskill.children
		this.setState( {
			standards: standards,
			showStandards: true
		} )

		if ( subskills[0].name === "" ) {
			let newSubskills = subskills.filter( (subskill) =>
				  subskill.name !== ""
			)
			this.setState( {
				subskills: newSubskills
			} )
			e.target.selectedIndex -= 1
		}
	}
	handleSubmit(e) {
		e.preventDefault() ;
		const elems = e.target.elements
		// standard boxes和url inputs一個和多個的情況要獨立處理
		// 所以最外層是standards是否array的判斷，再內一層才是檢查standards有無勾選(validation)
		// 最內一層則是檢查TextArea的值
		const standards = Array.from(elems.standard)
		if ( standards.length ) {

			if ( standards.some( (standardInput) => standardInput.checked ) ) {
				if ( editor.getData() ) {
					const standardsChecked = standards.filter( (standardInput) => 
						standardInput.checked
					)
					const standardVals = standardsChecked.map( (standardInput) => 
						standardInput.value
					)

					let courseUrls = [];
					const urlArray = Array.from(elems.courseURL)
					if ( urlArray.length ) {
						courseUrls = urlArray.map( (urlInput) => 
							urlInput.value
						)
					}
					else {
						courseUrls.push( elems.courseURL.value )
					}
						
					const fbMg = new FirebaseMg() ;
					var root = fbMg.myRef ;
					var path = 'Posts/'+ elems.subskill.value +"/"+ _uuid() ;
					var myRef = root.child(path) ;
					myRef.set( {
						user: "Louis",
						name: elems.postTitle.value,
						type: elems.courseType.value,
						course: {
							intro: editor.getData(),
							links: courseUrls,
							standards: standardVals,
						},
						like: 0,
						dislike: 0,
						view: 0,
						timePosted: new Date().toLocaleString()
					} ).then( () => {
						alert("發布完成！")
						// redirect
						this.props.history.goBack()
					} )
					.catch( (error) => {
						console.log(error) ;
					} ) ;
				}
				else {
					this.setState( {
						showTextAreaHelp: true
					} )
				}
			}
			else {
				if ( editor.getData() ) {
					this.setState( {
						showStdHelp: true,
						showTextAreaHelp: false
					} )
				}
				else {
					this.setState( {
						showStdHelp: true,
						showTextAreaHelp: true
					} )
				}
				
			}
		}
		else {
			const standard = elems.standard
			if ( standard.checked ) {
				if ( editor.getData() ) {
					let standardVals = [] ;
					standardVals.push( standard.value )
					let courseUrls = [];
					const urlArray = Array.from(elems.courseURL)
					if ( urlArray.length ) {
						courseUrls = urlArray.map( (urlInput) => 
							urlInput.value
						)
					}
					else {
						courseUrls.push( elems.courseURL.value )
					}
					const fbMg = new FirebaseMg() ;
					var root = fbMg.myRef ;
					var path = 'Posts/'+ elems.subskill.value +"/"+ _uuid() ;
					var myRef = root.child(path) ;
					myRef.set( {
						user: "Louis",
						name: elems.postTitle.value,
						type: elems.courseType.value,
						course: {
							intro: editor.getData(),
							links: courseUrls,
							standards: standardVals,
						},
						like: 0,
						dislike: 0,
						view: 0,
						timePosted: new Date().toLocaleString()
					} ).then( () => {
						alert("發布完成！")
						// redirect
						this.props.history.goBack()
					} )
					.catch( (error) => {
						console.log(error) ;
					} ) ;
				}
				else {
					this.setState( {
						showTextAreaHelp: true
					} )
				}
			}
			else {
				if ( editor.getData() ) {
					this.setState( {
						showStdHelp: true,
						showTextAreaHelp: false
					} )
				}
				else {
					this.setState( {
						showStdHelp: true,
						showTextAreaHelp: true
					} )
				}
				
			}
		}
		
	}
	chooseStandard(e) {
		if ( e.target.checked ) {
			this.setState( {
				showStdHelp: false
			} )
		}
	}
	clickUrlIncrease() {
		const courseNum = this.state.courseNum
		courseNum === 20 ? 
		alert("已到達課程數量上限。") :
		this.setState((state) => ({
		  courseNum: state.courseNum + 1
		}));
	}
	clickUrlDecrease() {
		const courseNum = this.state.courseNum
		courseNum === 1 ?
		this.setState((state) => ({
		  courseNum: 1
		})) :
		this.setState((state) => ({
		  courseNum: state.courseNum - 1
		}));
	}

	render( ) {
		const defaultData = this.state.defaultData
		const hasDefault = Boolean( defaultData )
		let subjectInput ;
		let fieldInput ;
		let skillInput ;
		let subskillInput ;
		let standardBoxes ;
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
			          <option>{defaultData.subject}</option>
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
			          <option>{defaultData.field}</option>
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
			          <option>{defaultData.skill}</option>
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
			          <option>{defaultData.subskill}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			standardBoxes =
				<Col md={{ span: 4, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="standard">
			        <Form.Label>選擇學習標準（至少選一種）</Form.Label>
			        <div>
			        	{	
				        	defaultData.standards.map( (standard) =>
				        		<Form.Check 
					    		inline 
					    		label={ standard.name } 
					    		type={'checkbox'} 
					    		onClick={ this.chooseStandard }
					    		value={ standard.name }
					    		name="standard"
					    		aria-describedby="checkboxHelp" />
				        	)
				        }
			        </div>
			        {
			        	this.state.showStdHelp ? 
			        	<Form.Text id="checkboxHelp" className="post help" >
						  請您為這堂課程選擇至少一個學習標準。
						</Form.Text> : ""
			        }
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
			          {
			          	this.state.subjects.map( (subject) => 
							<option>{subject.name}</option>
			          	)
			          }
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
			          onChange={this.chooseSubskill}
			          required>
			          {
			          	this.state.subskills.map( (subskill) => 
							<option>{subskill.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			if ( this.state.showStandards ) {
				standardBoxes =
		  		<Col md={{ span: 4, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="standard">
			        <Form.Label>選擇學習標準（至少選一種）</Form.Label>
			        <div>
			        	{	
				        	this.state.standards.map( (standard) =>
				        		<Form.Check 
					    		inline 
					    		label={ standard.name } 
					    		type={'checkbox'} 
					    		onClick={ this.chooseStandard }
					    		value={ standard.name }
					    		name="standard"
					    		aria-describedby="checkboxHelp" />
				        	)
				        }
			        </div>
			        {
			        	this.state.showStdHelp ? 
			        	<Form.Text id="checkboxHelp" className="post help" >
						  請您為這堂課程選擇至少一個學習標準。
						</Form.Text> : ""
			        }
			      </Form.Group>
			  	</Col>
			}
		}
		
		let urlInputs = []
		for ( var i = 2 ; i <= this.state.courseNum ; i++ ) {
			urlInputs.push( 
				<Form.Group as={Row} controlId="courseURL">
				  <Form.Label column sm="3" lg="2" className="post beforeInput">
				    <text>Course {i}</text>
				  </Form.Label>
				  <Col sm="9" lg="10">
				    <Form.Control
		         	  name="courseURL" placeholder="請輸入網址" required />
				  </Col>
				</Form.Group>
			 )
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
					  	{ standardBoxes }
					  </Form.Row>
						
					  <Form.Row>
					  	<Col md={{ span: 8, offset: 1 }}>
					  	  <Form.Group controlId="courseURL">
					        <Form.Label>課程網址</Form.Label>
					        <button className="post icon-btn" type="button" onClick={this.clickUrlIncrease}>
					        	<i className="fa fa-plus-square" aria-hidden="true"></i>
					        </button>
					        <button className="post icon-btn" type="button" onClick={this.clickUrlDecrease}>
					        	<i className="fa fa-minus-square" aria-hidden="true"></i>
					        </button>
					        <Form.Group as={Row} controlId="courseURL">
							  <Form.Label column sm="3" lg="2" className="post beforeInput">
							    Course 1
							  </Form.Label>
							  <Col sm="9" lg="10">
							    <Form.Control
					         	  name="courseURL" placeholder="請輸入網址" required />
							  </Col>
							</Form.Group>
					      </Form.Group>
					      { urlInputs }
					  	</Col>
					  	<Col md={2}>
					  	  <Form.Group controlId="courseType" className="post alignToURL">
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
					      <div className="post editor">
					      	<Form.Label>課程簡介</Form.Label>
					    	<CKEditor
		                    editor={ ClassicEditor }
		                    data="<p>請輸入簡介內容。</p>"
		                    config={ {
						        toolbar: ["heading", "|", "selectall", "bold", "italic", "blockQuote", "link", "undo", "redo", "|", "numberedList", "bulletedList", "insertTable", "tableColumn", "tableRow", "mergeTableCells"],
						        language: "zh-tw",
						        heading: {
						            options: [
						                { model: 'paragraph', title: '段落', class: 'ck-heading_paragraph' },
						                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
						            ]
        						}
						    } }
		                    onInit={ (newEditor) => editor = newEditor }
		                    />
					      </div>
					      {
				            this.state.showTextAreaHelp ? 
				        	<Form.Text id="textAreaHelp" className="post help" >
							  請您為這堂課輸入一些簡介。
							</Form.Text> : ""
				          }
					    </Col>
					  </Form.Row>

					  <div className="container">
					  	<div className="row justify-content-end">
					  	  <div className="col-md-4 button-col post">
					  	  	<button className="post-btn" type="submit">
						  	  	發布文章
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

export default withRouter(PostingPage) ;
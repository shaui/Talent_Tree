import React from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import FirebaseMg from '../Utils/FirebaseMg.js';
import './HuntingPage.css';
import { CSSTransition } from 'react-transition-group';

import HuntResult from './HuntResult.js' ;

class HuntingForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			subjects: [], 
			fields: [],
			chosenSubject: "",
			fieldObjs: [
				{ 
					skills: [],
					name: "",
				}
			],
			skillObjs: [
				{ 
					subskills: [],
					name: "",
				}
			],
			subskillObjs: [
				{
					name: "",
				}
			],
			profiles: [],
			showFields: false,
			showSkills: false,
			showSubskills: false,
			showResult: false,
			showProfile: false,
			showWarn: false,
			option: [],
			sentData: [],
		} ;
		this.chooseSubject = this.chooseSubject.bind(this) ;
		this.chooseField = this.chooseField.bind(this) ;
		this.chooseSkill = this.chooseSkill.bind(this) ;
		this.chooseSubskill = this.chooseSubskill.bind(this) ;
		this.handleSubmit = this.handleSubmit.bind(this) ;
		this.toggleProfile = this.toggleProfile.bind(this) ;
		this.chooseProfile = this.chooseProfile.bind(this) ;
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

		path = 'Company/companyID/profiles/' ;
		myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let profileObj = snapshot.val() ;
			
			this.setState( { 
				profiles: profileObj,
			} )

		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}

	chooseSubject(e) {
		// 抓原始tree資料
		let data = this.state.data
		// 把指定subject的children抓出來
		let fields = data[e.target.value]["children"]
		// 初始化資料，只留下指定科目下的領域
		this.setState( {
			chosenSubject: e.target.value,
			fields: fields,
			fieldObjs: [
				{ 
					skills: [],
					name: "",
				}
			],
			skillObjs: [
				{ 
					subskills: [],
					name: "",
				}
			],
			subskillObjs: [
				{
					name: "",
				}
			],
			showFields: true,
			showSkills: false,
			showSubskills: false
		} )
	}
	chooseField(e) {
		let fieldObjs = this.state.fieldObjs
		
		// 打勾選項
		if ( e.target.checked ) {
			let fields = this.state.fields

			// 取得選取的領域原Object（只有name跟children）
			let field = fields.find( (obj) => {
				return obj.name === e.target.value
			} )

			// 確認有無領域已被打勾（前者無，後者有）
			// 接著把Object重新包裝，放入checked，最後放進state
			if ( !fieldObjs[0].name ) {
				fieldObjs[0].name = field.name
				fieldObjs[0].skills = field.children
			}
			else {
				const fieldObj = { 
					skills: field.children,
					name: field.name,
				}
				
				fieldObjs.push( fieldObj )
			}

			this.setState( {
				fieldObjs: fieldObjs,
				showSkills: true
			} )
			
		} 

		// 取消選項
		else {
			// 取得取消的領域以外的Field Object
			let newFieldObjs = fieldObjs.filter( (obj) => {
				return obj.name !== e.target.value
			} )
			
			// 若取消後已無任何領域打勾，初始化Field Object，放進state
			// 還有打勾的就直接放進state
			if ( !newFieldObjs.length ) {
				this.setState( {
					fieldObjs: [
						{ 
							skills: [],
							name: "",
	
						}
					],
					skillObjs: [
						{ 
							subskills: [],
							name: "",
	
						}
					],
					subskillObjs: [
						{ 
							name: "",
	
						}
					],
					showSkills: false,
					showSubskills: false
				} )
			} 
			else {
				// 這裡要把取消的領域下的打勾技能節點也一併刪除，
				// 這樣subskillBoxed在render時才能對領域的取消勾選做出反應
				// 先撈出被取消的Field Object
				let canceledFieldObj = fieldObjs.find( (obj) => {
					return obj.name === e.target.value
				} )
				// 把每個打勾的技能節點對照取消的領域下的技能，過濾掉領域被取消的節點
				let newSkillObjs = this.state.skillObjs.filter( (obj) => {
					let skillChecked = canceledFieldObj.skills.map( ( skill ) =>
						obj.name === skill.name
					)
					// 有找到名稱相同的（要刪除的）就return false
					return !skillChecked.some( bool => Boolean(bool) )
				} )

				// 此處為仍有其他領域打勾，且還有技能節點打勾的情況
				if ( newSkillObjs.length ) {
					
					let canceledSkillObjs = this.state.skillObjs.filter( (obj) => {
						let skillChecked = canceledFieldObj.skills.map( ( skill ) =>
							obj.name === skill.name
						)
						// 有找到名稱相同的（要刪除的）就return true
						return skillChecked.some( bool => Boolean(bool) )
					} )
					
					let newSubskillObjs = this.state.subskillObjs.filter( (obj) => {
						// 檢查所有技能底下的子技能名稱
						let subskillChecked_All = canceledSkillObjs.map( (skills) => {
							// 檢查一個技能底下的子技能名稱
							let subskillChecked_One = skills.subskills.map( ( subskill ) =>
								obj.name === subskill.name
							)
							// return true 表示找到
							return subskillChecked_One.some( bool => Boolean(bool) )
						})
						// 有找到名稱相同的（要刪除的）就return false（排除）
						return !subskillChecked_All.some( bool => Boolean(bool) )
					} )

					this.setState( {
						fieldObjs: newFieldObjs,
						skillObjs: newSkillObjs,
						subskillObjs: newSubskillObjs
					} )
				} 
				// 此處為仍有其他領域打勾，但已無技能節點打勾的情況
				else {
					this.setState( {
						fieldObjs: newFieldObjs,
						skillObjs: [
							{ 
								subskills: [],
								name: "",
		
							}
						],
						subskillObjs: [
							{ 
								name: "",
		
							}
						],
						showSubskills: false
					} )
				}
				
			}
		}
		
	}
	chooseSkill(e) {
		let skillObjs = this.state.skillObjs
		
		// 打勾選項
		if ( e.target.checked ) {

			// 取得目前的Field Object
			let fieldObjs = this.state.fieldObjs

			// 從已打勾的領域內去找被勾選的技能
			let choosenSkill = ""
			fieldObjs.forEach( ( obj ) => {
				obj.skills.forEach( ( skill ) => {
					if ( skill.name === e.target.value )
						choosenSkill = skill
				} )
			} )

			// 有無初始化的寫法差異
			if ( !skillObjs[0].name ) {
				skillObjs[0].name = choosenSkill.name
				skillObjs[0].subskills = choosenSkill.children
			}
			else {
				const skillObj = { 
					subskills: choosenSkill.children,
					name: choosenSkill.name,
				}
				skillObjs.push( skillObj )
			}

			this.setState( {
				skillObjs: skillObjs,
				showSubskills: true
			} )
			
		} 

		// 取消選項
		else {
			// 取得取消的技能以外的Skill Object
			let newSkillObjs = skillObjs.filter( (obj) => {
				return obj.name !== e.target.value
			} )
			
			// 若取消後已無任何技能打勾，初始化Skill Object，放進state
			// 還有打勾的就直接放進state
			if ( !newSkillObjs.length ) {
				this.setState( {
					skillObjs: [
						{ 
							subskills: [],
							name: "",
	
						}
					],
					subskillObjs: [
						{
							name: "",
	
						}
					],
					showSubskills: false
				} )
			} 
			else {
				// 這裡要把取消的技能下的打勾子技能節點也一併刪除，
				// 這樣subskillBoxed在render時才能對領域的取消勾選做出反應
				// 先撈出被取消的Skill Object
				let canceledSkillObj = skillObjs.find( (obj) => {
					return obj.name === e.target.value
				} )
				// 把每個打勾的子技能節點對照取消的技能下的子技能，過濾掉技能被取消的節點
				let newSubskillObjs = this.state.subskillObjs.filter( (obj) => {
					let subkillChecked = canceledSkillObj.subskills.map( ( subskill ) =>
						obj.name === subskill.name
					)
					// 有找到名稱相同的（要刪除的）就return false
					return !subkillChecked.some( bool => Boolean(bool) )
				} )

				// 此處為仍有其他技能打勾，且還有子技能節點打勾的情況
				if ( newSubskillObjs.length ) {
					this.setState( {
						skillObjs: newSkillObjs,
						subskillObjs: newSubskillObjs
					} )
				} 
				// 此處為仍有其他技能打勾，但已無子技能節點打勾的情況
				else {
					this.setState( {
						skillObjs: newSkillObjs,
						subskillObjs: [
							{ 
								name: "",
		
							}
						]
					} )
				}
			}
		}
	}
	chooseSubskill(e) {
		let subskillObjs = this.state.subskillObjs
		
		// 打勾選項
		if ( e.target.checked ) {

			// 取得目前的Field Object
			let skillObjs = this.state.skillObjs

			// 從已打勾的技能內去找被勾選的子技能
			let choosenSubskill = ""
			skillObjs.forEach( ( obj ) => {
				obj.subskills.forEach( ( subskill ) => {
					if ( subskill.name === e.target.value )
						choosenSubskill = subskill
				} )
			} )

			// 有無初始化的寫法差異
			if ( !subskillObjs[0].name ) {
				subskillObjs[0].name = choosenSubskill.name
			}
			else {
				const subskillObj = { 
					name: choosenSubskill.name,
				}
				subskillObjs.push( subskillObj )
			}

			this.setState( {
				subskillObjs: subskillObjs,
			} )
			
		} 

		// 取消選項
		else {
			// 取得取消的子技能以外的Subskill Object
			let newSubskillObjs = subskillObjs.filter( (obj) => {
				return obj.name !== e.target.value
			} )
			
			// 若取消後已無任何子技能打勾，初始化Subskill Object，放進state
			// 還有打勾的就直接放進state
			if ( !newSubskillObjs.length ) {
				this.setState( {
					subskillObjs: [
						{ 
							name: "",
						}
					]
				} )
			} 
			else {
				this.setState( {
					subskillObjs: newSubskillObjs
				} )
			}
		}
	}

	handleSubmit(e) {
		e.preventDefault() ;
		const elems = e.target.elements
		
		if ( this.state.subskillObjs[0].name === "" ) {
			this.setState( {
				showWarn: true
			} )
			if ( this.timer ) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout( () => {
				this.setState( {
					showWarn: false
				} )
			}, 3000 )
		} else {
			// deep clone深度不為一的物件
			let data = JSON.parse(JSON.stringify(this.state.data))
			const chosenFields = this.state.fieldObjs
			const chosenSkills = this.state.skillObjs
			const chosenSubskills = this.state.subskillObjs
			data = data["資管系"]
			// data = data.find( (subject) => 
			// 	subject.name === elems.subject.value
			// )
			data.children = data.children.filter( (field) => {
				let checked = chosenFields.map( (fieldObj) => 
					field.name === fieldObj.name
				)
				return checked.some( bool => Boolean(bool) )
			} )
			for ( var i in data.children ) {
				data.children[i].children = data.children[i].children.filter( (skill) => {
					let checked = chosenSkills.map( (skillObj) => 
					skill.name === skillObj.name
				)
				return checked.some( bool => Boolean(bool) )
				} )
			}
			for ( var x in data.children ) {
				for ( var y in data.children[x].children ) {
					data.children[i].children[y].children = data.children[i].children[y].children.filter( (subskill) => {
						let checked = chosenSubskills.map( (subskillObj) => 
						subskill.name === subskillObj.name
					)
					return checked.some( bool => Boolean(bool) )
					} )
				}
			}
			
			// console.log( "subject:", elems.subject );
			// console.log( "field:", elems.field );
			// console.log( "skill:", elems.skill );
			// console.log( "subskill:", elems.subskill );
			const subskillInputs = Array.from(elems.subskill).filter( (input) => {
					return input.checked 
				}
			)
			const subskills = subskillInputs.map( (input) =>
				input.value
			)
			this.setState( {
				option: subskills,
				sentData: data,
				showResult: true
			} )
		}

		
	}

	toggleProfile() {
		const showProfile = this.state.showProfile
		
		// 取消自定義
		if ( showProfile ) {
			this.setState( { 
				fields: [],
				chosenSubject: "",
				fieldObjs: [
					{ 
						skills: [],
						name: "",
					}
				],
				skillObjs: [
					{ 
						subskills: [],
						name: "",
					}
				],
				subskillObjs: [
					{
						name: "",
					}
				],
				showFields: false,
				showSkills: false,
				showSubskills: false,
				showResult: false
			} )
		}

		this.setState( { 
			showProfile: !showProfile
		} )
	}
	chooseProfile(e) {
		let subject ;
		let fieldObjs ;
		let skillObjs ;
		let subskillObjs ;
		const data = this.state.data
		const profileName = e.target.value
		const profileObj = this.state.profiles
		let profileID = "" ;
		for ( var i in profileObj ) {
			if ( profileObj[i].name === profileName )
				profileID = i
		}

		subject = profileObj[profileID].tree.name

		let fieldsAll = data[subject]["children"]
		
		let fields = fieldsAll.filter( (field) => {
			let checked = profileObj[profileID].tree.children.map( (chosenField) => 
				field.name === chosenField.name
			)
			return checked.some( bool => Boolean(bool) )
		} )

		fieldObjs = fields.map( (field) => {
				return {
					skills: field.children,
					name: field.name
				}
		} )

		let chosenSkills = profileObj[profileID].tree.children.map( (chosenField) => 
			chosenField.children
		)
		chosenSkills = chosenSkills.flat()
		let skillsAll = fields.map( (field) =>
			field.children
		)
		skillsAll = skillsAll.flat()
		let skills = []
		chosenSkills.forEach( (chosenSkill) =>
			skills = skillsAll.filter( (skill) =>
				chosenSkill.name === skill.name
			)	
		)
		skillObjs = skills.map( (skill) => {
				return {
					subskills: skill.children,
					name: skill.name
				}
		} )

		let chosenSubskills = chosenSkills.map( (chosenSkill) => 
			chosenSkill.children
		)
		chosenSubskills = chosenSubskills.flat()
		let subskillsAll = skills.map( (skill) =>
			skill.children
		)
		subskillsAll = subskillsAll.flat()
		let subskills = []
		chosenSubskills.forEach( (chosenSubskill) =>
			subskills = subskillsAll.filter( (subskill) =>
				chosenSubskill.name === subskill.name
			)	
		)
		subskillObjs = subskills.map( (subskill) => {
				return {
					name: subskill.name
				}
		} )
		
		this.setState( {
			chosenSubject: subject,
			fields: fieldsAll,
			fieldObjs: fieldObjs,
			skillObjs: skillObjs,
			subskillObjs: subskillObjs,
			showFields: true,
			showSkills: true,
			showSubskills: true
		} )

	}

	render( ) {
		
		let fieldObjs = this.state.fieldObjs
		const chooseField = this.chooseField
		let fieldButtons = this.state.fields.map( (field) => {

			let checked = fieldObjs.map( (fieldObj) => 
				field.name === fieldObj.name
			)
			return checked.some( bool => Boolean(bool) ) ?
    		<Form.Check 
    		inline 
    		label={ field.name } 
    		type={'checkbox'} 
    		onClick={ chooseField }
    		value={ field.name }
    		name="field"
    		checked /> :
    		<Form.Check 
    		inline 
    		label={ field.name } 
    		type={'checkbox'} 
    		onClick={ chooseField }
    		value={ field.name }
    		name="field"
    		checked={false} />
    	} )

		// 因為有多選，所以當某個上層節點被取消勾選時，
		// 要保持其他勾選的上層節點的children的render（條件render）
		let skillObjs = this.state.skillObjs
		const chooseSkill = this.chooseSkill
		let skillBoxes = this.state.fieldObjs.map( (fieldObj) => {

			let form = fieldObj.skills.map( function(skill) {
				// 所有Skills都要對照Skill Object來找出已打勾的節點（因此checked為陣列）
				let checked = skillObjs.map( function(skillObj) {
					return ( skillObj.name === skill.name )
				} )
				// 檢查每個Skill對所有Skill Object的對照結果，只要一個true（有找到）便打勾
				return checked.some( bool => Boolean(bool) ) ?	
					<Form.Check 
		    		inline 
		    		label={ skill.name } 
		    		type={'checkbox'} 
		    		onClick={ chooseSkill }
		    		value={ skill.name }
		    		name="skill"
		    		checked /> :
		    		<Form.Check 
		    		inline 
		    		label={ skill.name } 
		    		type={'checkbox'} 
		    		onClick={ chooseSkill }
		    		value={ skill.name }
		    		name="skill" />
			} )

			return (
				<Col md={{ span: 11, offset: 1 }} sm={{ span: 11, offset: 1 }} xs={{ span: 11, offset: 1 }} >
					<hr className="hunt" />
					<Row>
						<small>{ fieldObj.name }</small>
					</Row>
					<Row>
						<Col>
							{ form }
						</Col>
					</Row>
				</Col>
			) 

		} )

		let subskillObjs = this.state.subskillObjs
		const chooseSubskill = this.chooseSubskill
		let subskillBoxes = skillObjs.map( (skillObj) => {

			let form = skillObj.subskills.map( function(subskill) {
				// 所有Subskills都要對照Subskill Object來找出已打勾的節點（因此checked為陣列）
				let checked = subskillObjs.map( function(subskillObj) {
					return ( subskillObj.name === subskill.name )
				} )
				// 檢查每個Subskill對所有Subskill Object的對照結果，只要一個true（有找到）便打勾
				return checked.some( bool => Boolean(bool) ) ?	
					<Form.Check 
		    		inline 
		    		label={ subskill.name } 
		    		type={'checkbox'} 
		    		onClick={ chooseSubskill }
		    		value={ subskill.name }
		    		name="subskill"
		    		checked /> :
		    		<Form.Check 
		    		inline 
		    		label={ subskill.name } 
		    		type={'checkbox'} 
		    		onClick={ chooseSubskill }
		    		value={ subskill.name }
		    		name="subskill" />
			} )
			return (
				<Col md={{ span: 11, offset: 1 }} sm={{ span: 11, offset: 1 }} xs={{ span: 11, offset: 1 }} >
					<hr className="hunt" />
					<Row>
						<small>{ skillObj.name }</small>
					</Row>
					<Row>
						<Col>
							{ form }
						</Col>
					</Row>
				</Col>
			) 
		} )
		
		let profileObj = this.state.profiles
		let profiles = [] ;
		for ( var i in profileObj ) {
			profiles.push( profileObj[i] )
		}
		const profileButtons = profiles.map( (profile) =>
    		<Form.Check 
    		label={ profile.name } 
    		type={'radio'} 
    		onChange={ this.chooseProfile }
    		value={ profile.name }
    		name="profile" />
    	)

		return (
			<div className="content" style={{ 'marginTop': '12vh' }}>
				<div className="container">
					<Card>
					  <Card.Header className="hunt">
					    <text>
					  	  人才徵選
					    </text>
					  	<button style={{float: "right"}} onClick={this.toggleProfile} className="post-btn right" type="button" data-toggle="collapse" data-target="#collapseCustomCard" aria-expanded="false" aria-controls="collapseCustomCard">
					      {
					      	this.state.showProfile ? "取消自定義搜尋" : "自定義搜尋"
					      }
					    </button>
					  </Card.Header>
					  {
					    this.state.showProfile ?
					    <div id="collapseCustomCard">
						  <div className="card card-body">
						    <Form>
						    	<Form.Group controlId="profile" style={{ marginBottom: "0px" }}>
						        { profileButtons }
						      </Form.Group>
						    </Form>
						  </div>
					    </div>
					    : ""
					  }
					  <CSSTransition in={this.state.showWarn} timeout={500} classNames="alert" unmountOnExit appear>
					    <Alert variant="danger" className="hunt">
				          <Alert.Heading>提示</Alert.Heading>
				          <p>
				            請選擇到有至少一個子技能後再提送表單！
				          </p>
				        </Alert>
			          </CSSTransition>
					  
					  
					  <Card.Body>
					    <Card.Title>條件選擇</Card.Title>
					    <Form onSubmit={this.handleSubmit} >
						  <Form.Row>
						  	
						  	<Col md={{ span: 2, offset: 1 }} sm={6} xs={12}>
						  	  <Form.Group controlId="subject">
						        <Form.Label>選擇科系</Form.Label>
						        <div>
						        	{
							    //     	this.state.subjects.map( (subject) => 
											// <Form.Check 
								   //  		inline 
								   //  		label={ this.state.subjects.name } 
								   //  		type={'radio'} 
								   //  		onClick={this.chooseSubject}
								   //  		value={ this.state.subjects.name } />
							    //       	)
							    		this.state.chosenSubject === this.state.subjects.name ?
							    		<Form.Check 
							    		inline 
							    		label={ this.state.subjects.name } 
							    		type={'radio'} 
							    		onChange={ this.chooseSubject }
							    		value={ this.state.subjects.name }
							    		name="subject"
							    		checked /> :
							    		<Form.Check 
							    		inline 
							    		label={ this.state.subjects.name } 
							    		type={'radio'} 
							    		onChange={ this.chooseSubject }
							    		value={ this.state.subjects.name }
							    		name="subject" />
							        }
						        </div>
						      </Form.Group>
						  	</Col>
						  	
						  </Form.Row>

						  <Form.Row>
						  	<Col md={{ span: 10, offset: 1 }} sm={12} xs={12} className={this.state.showFields ? '' : 'hidden hunt'}>
						  	  <Form.Group controlId="field">
						        <Form.Label>選擇領域</Form.Label>
						        <div>
						        	{ fieldButtons }
						        </div>
						      </Form.Group>
						  	</Col>
						  </Form.Row>

						  <Form.Row>
						  	<Col md={{ span: 10, offset: 1 }} sm={12} xs={12} className={this.state.showSkills ? '' : 'hidden hunt'}>
						  	  <Form.Group controlId="skill">
						        <Form.Label>選擇技能</Form.Label>
						        <Row className="hunt">
						        	{ skillBoxes }
						        </Row>
						      </Form.Group>
						  	</Col>
						  </Form.Row>

						  <Form.Row>
						  	<Col md={{ span: 10, offset: 1 }} sm={12} xs={12} className={this.state.showSubskills ? '' : 'hidden hunt'}>
						  	  <Form.Group controlId="subskill">
						        <Form.Label>選擇子技能</Form.Label>
						        <Row className="hunt">
						        	{ subskillBoxes }
						        </Row>
						      </Form.Group>
						  	</Col>
						  </Form.Row>

						  <div className="container">
						  	<div className="row justify-content-end">
						  	  <div className="col-md-4 button-col hunt">
						  		<button type="submit" className="post-btn">
						        	送出表單
						  	  	</button>
						  	  </div>
						  	  <div className="col-md-1">
						  	  </div>
						    </div>
						  </div>
						  
						</Form>
					  </Card.Body>
					</Card>
					{
						this.state.showResult ? 
						<HuntResult 
						option={this.state.option} 
						treeData={this.state.sentData} 
						profiles={this.state.profiles}
						useProfile={this.state.showProfile} /> : ""
					}
				</div>
			</div>
		);
	}
}

class HuntingPage extends React.Component {

	render() {
		return (
			<HuntingForm />
		);
	}
}

export default HuntingPage;
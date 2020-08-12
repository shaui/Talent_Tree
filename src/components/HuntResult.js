import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import './HuntResult.css';
import FirebaseMg from '../Utils/FirebaseMg.js'

function CustomModal(props) {

  const [showNewCstmOpt, setShowNewCstmOpt] = useState(false);
  const [showUpdateCstmOpt, setShowUpdateCstmOpt] = useState(false);

  const useProfile = props.useProfile
  let handleShow = useProfile ? 
  () => setShowUpdateCstmOpt(true) :
  () => setShowNewCstmOpt(true)

  const handleCloseNew = () => setShowNewCstmOpt(false);
  	
  const handleCloseUpdt = () => setShowUpdateCstmOpt(false);
  
  let profileObj = props.profiles
  let profiles = [] ;
  for ( var i in profileObj ) {
	profiles.push( profileObj[i] )
  }
  const profileOptions = profiles.map( (profile) =>
	<option>{profile.name}</option> 
  )

  return (
  	<div style={{textAlign: "right"}}>
  		<button className="post-btn" onClick={handleShow}>
  		  {
  		  	useProfile ? "更新自定義組合" : "新增自定義組合"
  		  }
  		</button>

	    <Modal show={showNewCstmOpt} onHide={handleCloseNew} size="lg" centered>
	      <Form onSubmit={props.addProfile}>
	      	<Modal.Header closeButton>
	          <Modal.Title>新增</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
	          <div>
	        	<Form.Group controlId="profileName">
	        		<Form.Label>自定義組合名稱</Form.Label>
    				<Form.Control 
    				name="profileName" 
    				placeholder="請輸入名稱" 
    				className="hunt"
    				required />
	        	</Form.Group>
	          </div>
	        </Modal.Body>
	        <Modal.Footer>
	      	  <Button type="button" variant="secondary" onClick={handleCloseNew}>
                取消
              </Button>
              <Button type="submit" variant="primary" onClick={handleCloseNew}>確定</Button>
            </Modal.Footer>
	      </Form>
	    </Modal>

	    <Modal show={showUpdateCstmOpt} onHide={handleCloseUpdt} size="lg" centered>
	      <Form onSubmit={props.updateProfile}>
	      	<Modal.Header closeButton>
	          <Modal.Title>更新</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
	          <div>
	        	<Form.Group controlId="profile">
		          <Form.Label>選擇組合</Form.Label>
		          <Form.Control
		            name="profile"
		            className="hunt" 
		            as="select"
		            required>
		            <option></option>
		            { profileOptions }
		          </Form.Control>
		        </Form.Group>
	          </div>
	        </Modal.Body>
	        <Modal.Footer>
	      	  <Button type="button" variant="secondary" onClick={handleCloseUpdt}>
                取消
              </Button>
              <Button type="submit" variant="primary" onClick={handleCloseUpdt}>確定</Button>
            </Modal.Footer>
	      </Form>
	    </Modal>
	    
  	</div>
  );
}

function ResultTable(props) {
	const users = props.data ;
	let userItems = [] ; 
	for ( var i in users ) {
		userItems.push(
			<tr>
	            <td className="userName hunt">{users[i].name}</td>
	            <td colSpan="2" className="userEmail hunt">xxxx@gmail.com</td>
	            <td className="hunt"><Button variant="outline-danger">技能樹</Button></td>
	            <td className="hunt"><Button variant="outline-primary">個人頁面</Button></td>
	        </tr>
		)
	}
	return (
		<Table hover responsive>
	        <thead>
		        <tr>
		            <th className="hunt">用戶名稱</th>
		            <th className="hunt">用戶信箱</th>
		            <th className="hunt"></th>
		            <th className="hunt"><span style={{'marginLeft':'10px'}}>技能樹</span></th>
		            <th className="hunt"><span style={{'marginLeft':'10px'}}>個人資料</span></th>
		        </tr>
	        </thead>
	        <tbody>
	            {userItems}
	        </tbody>
	    </Table>
	);
}

class HuntResult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			target: []
		} ;
		this.filterUser = this.filterUser.bind(this)
		this.addProfile = this.addProfile.bind(this)
		this.updateProfile = this.updateProfile.bind(this)
	}
	
	componentDidMount() {
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Users' ;
		var myRef = root.child(path) ;
		myRef.once('value').then( (snapshot) => {
			let data = snapshot.val() ;

			//把object轉成array
			let dataArr = [];
			for(var item in data){
				dataArr.push(data[item])
			}

			//用data和option篩出目標用戶
			let target = this.filterUser(dataArr, this.props.option)
			this.setState({
				data: dataArr,
				target: target,
			}) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
		console.log("mount: ", this.props);
	}

	componentDidUpdate(prevProps) {
	  // 常見用法（別忘了比較 prop）：
	  if (this.props.option !== prevProps.option) {
	    let target = this.filterUser(this.state.data, this.props.option)
		this.setState({
			target : target
		}) ;
	  }
	}

	filterUser(data, option){
		//所有user
		const users = data
		//搜尋條件
		var option = option
		//是結果的user的array
		var target = []
		//跑每一個user的tree state
		const userData = users.map( function(user){
			let isResult = 0

			//跑每一個系
			for(var i in user.treeState){
				//跑每一個subskill(第四層節點)
				for(var j in user.treeState[i].state){
					//subskill(第四層節點)的名字&完成度
					let subskill = user.treeState[i].state[j].name
					let complete = user.treeState[i].state[j].completed

					//檢查該subskill是否存在搜尋條件裡，且進度不為0
					if(option.indexOf(subskill)>-1 && complete>0){
						//isResult+1，且當isResult == option長度時即為滿足所有條件
						isResult += 1
						if(isResult == option.length){
							break
						}
					}
				}
				if(isResult == option.length){
					break
				}
			}
			//把滿足條件的user塞進target array
			if(isResult == option.length){
				target.push(user)
			}
		} );
		return target
	}

	addProfile(e) {
		e.preventDefault() ;
		const searchResult = this.state.target.length ? this.state.target : "null"
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Company/companyID/profiles/' ;
		var myRef = root.child(path) ;
		var newProfileKey = myRef.push().key;
		root.child(path+newProfileKey).set( {
			name: e.target.elements.profileName.value,
			tree: this.props.treeData,
			result: searchResult,
			timePosted: new Date().toLocaleString()
		} )
		.then( () => {
			alert("上傳完成！")
			window.location.reload()
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
	}
	updateProfile(e) {
		e.preventDefault() ;
		let profileID ;
		let profiles = this.props.profiles
		for ( var i in profiles ) {
			if ( profiles[i].name === e.target.elements.profile.value )
				profileID = i
		}
		const fbMg = new FirebaseMg() ;
		var root = fbMg.myRef ;
		var path = 'Company/companyID/profiles/' + profileID ;
		var myRef = root.child(path) ;
		myRef.update( {
			name: e.target.elements.profile.value,
			tree: this.props.treeData,
			result: this.state.target,
			timePosted: new Date().toLocaleString()
		} )
		.then( () => {
			alert("更新完成！")
			window.location.reload()
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;

	}

	render() {
		console.log(this.props.useProfile);
		return (
			<Card>
				<Card.Header>搜尋結果</Card.Header>
				<Card.Body>
					<div className="row">
						<div className="col">
							<ResultTable data={this.state.target}/>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<CustomModal 
							show={false} 
							addProfile={this.addProfile} 
							updateProfile={this.updateProfile} 
							profiles={this.props.profiles}
							useProfile={this.props.useProfile} />
						</div>
						<div className="col-md-1">
						</div>
					</div>
				</Card.Body>
			</Card>
		);
	}
}

export default HuntResult;
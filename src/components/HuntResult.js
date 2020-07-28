import React from 'react';
import { Card, Table } from 'react-bootstrap';
import './HuntResult.css';
import FirebaseMg from '../Utils/FirebaseMg.js'

function ResultTable(props) {
	const users = props.data ;
	let userItems = [] ; 
	for ( var i in users ) {
		userItems.push(
			<tr>
	            <td className="userName hunt">{users[i].name}</td>
	            <td colSpan="2" className="userEmail hunt">xxxx@gmail.com</td>
	            <td className="hunt"><button id="post-btn" className="primary">技能樹</button></td>
	            <td className="hunt"><button id="post-btn" className="primary">個人頁面</button></td>
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
			option: this.props.option,
			target: []
		} ;
		this.filterUser = this.filterUser.bind(this)
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
			let target = this.filterUser(dataArr, this.state.option)
			this.setState({
				data : dataArr,
				target : target
			}) ;
		} )
		.catch( (error) => {
			console.log(error) ;
		} ) ;
		console.log("mount: ", this.props);
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
					console.log("subskill :", subskill)
					console.log("complete :", complete)

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

	render() {
		return (
			<Card>
				<Card.Header>搜尋結果</Card.Header>
				<Card.Body>
					<div className="row">
						<div className="col">
							<ResultTable data={this.state.target}/>
						</div>
					</div>
				</Card.Body>
			</Card>
		);
	}
}

export default HuntResult;
import React, {Component} from 'react';
import './CoursePage.css';
import $ from 'jquery';
import FirebaseMg from '../Utils/FirebaseMg.js';
import UserContext from '../Contexts/UserContext'
import parse from 'html-react-parser';

const fbMg = new FirebaseMg()
var root = fbMg.myRef

function _uuid() {
  var d = Date.now() ;
  if ( typeof performance !== 'undefined' && typeof performance.now === 'function' ){
  	d += performance.now() ;
  	//use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  	var r = (d + Math.random() * 16) % 16 | 0 ;
    d = Math.floor(d / 16) ;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) ;
  });
}

function Course(props) {
  const node=props.node
  const level=props.level
  const updateUserState=props.updateUserState
  const intro=props.intro
  const links=props.links
  const name=props.name
//   const imgURL=props.imgURL
  return (
    <div className="container">
		<div>
			<h1>{name}</h1>
		</div>
      <div className="CoursePage row course-icon">
      	<div className="col">
      		<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRw728JESaDNMSj_h3zrUUD49Xwgf0WNGAQcZKn7Kk9aZm2fGMK&usqp=CAU" className="img-thumbnail float-left" alt="Cinque Terre" style={{'width':'20vw','marginBottom':'10px'}}/>
      		{/* <img src={imgURL} className="img-thumbnail float-left" alt="Cinque Terre" style={{'width':'20vw','marginBottom':'10px'}}/> */}
		<div className="CoursePage row course-introduction" style={{'height':'35%'}}>
			<div className="col">

				<p className="CoursePage text-justify" style={{'fontSize':'16pt'}}>{parse(intro)}</p>
			</div>
      	</div>
	  <div className="CoursePage row" style={{'height':'45%'}}>
	  	<GetSkills node={node} level={level} />
	  </div>
      <div className="CoursePage row course-link" style={{'height':'20%'}}>
		<div className="col">
			<GetLinks links={links} />
			<button className='CoursePage btn btn-info' style={{'float':'right'}} onClick={updateUserState}>完成課程</button>
		</div>
      </div>
      	</div>

      </div>

    </div>
  );
}

function GetSkills(props){
	const node=props.node

	var list=[]
	console.log(node)
	node.map((content,index)=>{
		list.push(
			<span key={index} className='CoursePage tag'>✔ {content}</span>
		)
	})


	return(
		<div>
			<div className="col">
				<span style={{'fontSize':'16pt'}}>完成此課程將可習得【{props.level}】相關技能：</span>
			</div>
			<div className="col">
				{list}

			</div>
		</div>
	);

}

function GetLinks(props){
	const links=props.links

	var list=[]
	console.log(links)
	links.map((content,index)=>{
		list.push(
			<a href={content} key={index} className='CoursePage btn btn-info' role="button" aria-pressed="true">Course {index+1}</a>
		)
	})
	return list;
}

function Comment(props) {
  return (
    <div className="container">
		<div className="CoursePage card">
			<div className="CoursePage card-body">

				<div className="CoursePage circular-avatar float-left">
					<img src="http://petonea.com/file//n373/t.jpg" className="CoursePage card-avatar"/>
				</div>
				<div className="CoursePage content">
					<span class="CoursePage user-name">Louis</span>
					<span style={{'marginLeft':'10px'}}> 2020/9/9</span>
					<p className="CoursePage card-text">
						關注了Tensorflow For CNN Cifar-10
					</p>
				</div>
				<div className="CoursePage actions">
					<a href="#">
						<span class="glyphicon glyphicon-heart" aria-hidden="true"></span>
					</a>
				</div>

			</div>
		</div>
    </div>
  );
}

class CoursePage extends Component{
	static contextType = UserContext;
	constructor(props){
		super(props)
		this.state = {
			// id:"3ee4e691-18de-4060-a466-dda24cf94b22",
			// name:"JAVA 基礎教學",
			// level:"JAVA 1級",
			id:props.location.state.id,
			name:props.location.state.name,
			level:props.location.state.level,
			intro:"",
			node:[],
			links:[],
			comments:[],
			// imgURL:""

		}
	}

	componentDidMount(){
		console.log('id=',this.state.id)
		console.log('level=',this.state.level)

		var myRef=root.child('Posts/'+this.state.level+'/'+this.state.id+'/course')
		myRef.once('value',(snapshot)=>{
			let data = snapshot.val()
			this.setState({
				node:data["standards"],
				intro:data["intro"],
				links:data["links"],
				comments:data["comments"]
			})
		})
	}
	updateUserState=()=>{
		let skillName = this.state.level
		let skillStd = this.state.node

		let path = "Users/" + this.context.user.uid + "/treeState/" + "資管系" + "/state"
    	let myRef = root.child(path)
		console.log("此用戶技能被點亮：",this.context.user.uid)
    	myRef.once('value', (snapshot) => {
			let data = snapshot.val()
			let path1 = 666 //儲存Skill的Index
			let path2 = [] //儲存Std的Index
			let stdName = []
			let childrenLength = 666 //計算Progress用的參數

			//儲存各階層的index
			data.forEach( (skill, index) =>{

				if(skill["name"] === skillName){
					path1 = index
					childrenLength = skill["children"].length

					skill["children"].forEach( (std, index) =>{
						if(skillStd.includes(std["name"])){
							path2.push(index)
							stdName.push(std["name"])
						}
					})
				}
			})

			//遍歷每個Std，點亮未點亮的部分
			path2.forEach((pathIndex, index)=>{
				let skillStdPath = path + "/" + path1 + "/children/" + pathIndex + "/nodeSvgShape/shapeProps"
				let skillStdRef = root.child(skillStdPath)

				skillStdRef.once('value', (snapshot) => {
					let skillStdData = snapshot.val()
					console.log("skillStdData:", skillStdData)

					if(skillStdData["fill"] !== "yellow"){
						skillStdRef.update({"fill": "yellow"}) //點亮節點
						console.log("skillStdData:", skillName, stdName[index], childrenLength)
						this.updateProgress(skillName, stdName[index], childrenLength)
					}
				})
			})


    	}).then( (result) => {
			alert("操作成功")
    	}).catch( (failureCallback) =>{
			// console.log("failureCallback:",failureCallback)
			alert("操作失敗，請再試一次")
    	});
	}

	updateProgress(skillName, skillStdName, childrenLength){
		let path = "Users/" + this.context.user.uid + "/progress/" + skillName
    	let myRef = root.child(path)

    	myRef.once('value', (snapshot)=> {
			let data = snapshot.val()
			if(data){
				let progress = data['completed']
				let completedNum = data['children'].length
				//如果一開始沒有,data預設為0
				if(!completedNum){
					completedNum = 0
				}

				//update skill standard information
				let childrenData = new Object()
				childrenData[completedNum] = skillStdName
				myRef.child("children").update(childrenData)


				//update progress
				progress = progress + 1/childrenLength

				//避免因除法導致小數點未進位
				if(0.95 <= progress && progress <= 1){
					progress = 1
				}
				myRef.update({
					"completed": progress
				})
			}else{
				let path = "Users/" + this.context.user.uid + "/progress"
				let myRef = root.child(path)

				let progressData = new Object()
				progressData[skillName] = {
					"children":{
						0: skillStdName
					},
					"completed": 1/childrenLength
				}
				myRef.update(progressData)
			}

    	}).then((result)=>{

    	})
	}

	render() {
		return (
			<div className='container' style={{'paddingTop':'10vh'}}>
				<div className='CoursePage row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<Course
							name={this.state.name}
							node={this.state.node}
							level={this.state.level}
							intro={this.state.intro}
							links={this.state.links}
							updateUserState={this.updateUserState}
						 	// imgURL={this.state.imgURL}

						 />
					</div>
				</div>
				<div className='CoursePage row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<Comment />
						<Comment />
						<Comment />
						<Comment />
					</div>
				</div>
			</div>
		);
	}
}

export default CoursePage;
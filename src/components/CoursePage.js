import React, {Component} from 'react';
import './CoursePage.css';
import $ from 'jquery';
import FirebaseMg from '../Utils/FirebaseMg.js';

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
  return (
    <div className="container">
		<div>
			<h1>Python</h1>
		</div>
      <div className="CoursePage row course-icon">
      	<div className="col">
      		<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRw728JESaDNMSj_h3zrUUD49Xwgf0WNGAQcZKn7Kk9aZm2fGMK&usqp=CAU" className="img-thumbnail float-left" alt="Cinque Terre" style={{'width':'20vw','marginBottom':'10px'}}/>
      		<div className="CoursePage row course-introduction">
		<div className="col">
		    <p className="CoursePage text-justify">Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Praeterea iter est quasdam res quas ex communi. At nos hinc posthac, sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem certam indicere. Cras mattis iudicium purus sit amet fermentum.</p>
		</div>
      </div>

      <div className="CoursePage row course-link">
		<div className="col">
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 1</a>
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 2</a>
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 3</a>
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 4</a>
		</div>
      </div>
      	</div>

      </div>
      
    </div>
  );
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
					<h5 class="CoursePage user-name">2020/9/9</h5>
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
	constructor(props){
		super(props)
		this.state = {

		}
	}

	// updateUserState(){
	// 	let skillName = ""
	// 	let skillStd = []

	// 	let path = "Users/" + this.context.user.uid + "/treeState/" + "資管系" + "/state"
 //    	let myRef = root.child(path)

 //    	myRef.once('value', (snapshot) => {
	// 		let data = snapshot.val()
	// 		let path1 = 666 //儲存Skill的Index
	// 		let path2 = [] //儲存Std的Index
	// 		let stdName = []
	// 		let childrenLength = 666 //計算Progress用的參數

	// 		//儲存各階層的index
	// 		data.forEach( (skill, index) =>{
				
	// 			if(skill["name"] === skillName){
	// 				path1 = index
	// 				childrenLength = skill["children"].length
					
	// 				skill["children"].forEach( (std, index) =>{
	// 					if(skillStd.includes(std["name"])){
	// 						path2.push(index)
	// 						stdName.push(std["name"])
	// 					}
	// 				})
	// 			}
	// 		})
			
	// 		//遍歷每個Std，點亮未點亮的部分
	// 		path2.forEach((pathIndex, index)=>{
	// 			let skillStdPath = path + "/" + path1 + "/children/" + pathIndex + "/nodeSvgShape/shapeProps"
	// 			let skillStdRef = root.child(skillStdPath)

	// 			skillStdRef.once('value', (snapshot) => {
	// 				let skillStdData = snapshot.val()
	// 				console.log("skillStdData:", skillStdData)

	// 				if(skillStdData["fill"] !== "yellow"){
	// 					skillStdData.update({"fill": color}) //點亮節點
	// 					console.log("skillStdData:", skillName, stdName[index], childrenLength)
	// 					updateProgress(skillName, stdName[index], childrenLength)
	// 				}
	// 			})
	// 		})
				

 //    	}).then( (result) => {

 //    	}).catch( (failureCallback) =>{
	// 		// console.log("failureCallback:",failureCallback)
 //    	});		
	// }

	// updateProgress(skillName, skillStdName, childrenLength){
	// 	let path = "Users/" + this.context.user.uid + "/progress/" + skillName
 //    	let myRef = root.child(path)	
    	
 //    	myRef.once('value', (snapshot)=> {
	// 		let data = snapshot.val()
	// 		if(data){
	// 			let progress = data['completed']
	// 			let completedNum = data['children'].length
	// 			//如果一開始沒有,data預設為0
	// 			if(!completedNum){
	// 				completedNum = 0
	// 			}

	// 			//update skill standard information
	// 			let childrenData = new Object()
	// 			childrenData[completedNum] = skillStdName
	// 			myRef.child("children").update(childrenData)

				
	// 			//update progress
	// 			progress = progress + 1/childrenLength

	// 			//避免因除法導致小數點未進位
	// 			if(0.95 <= progress && progress <= 1){
	// 				progress = 1
	// 			}
	// 			myRef.update({
	// 				"completed": progress
	// 			})
	// 		}else{
	// 			let path = "Users/" + this.context.user.uid + "/progress"
	// 			let myRef = root.child(path)
				
	// 			let progressData = new Object()
	// 			progressData[skillName] = {
	// 				"children":{
	// 					0: skillStdName
	// 				},
	// 				"completed": 1/childrenLength
	// 			}
	// 			myRef.update(progressData)
	// 		}

 //    	}).then((result)=>{

 //    	})	
	// }

	render() {
		return (
			<div className='container' style={{'paddingTop':'10vh'}}>
				<div className='CoursePage row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<Course />
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
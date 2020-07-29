import React, {Component} from 'react';
import './MyTree.css';

//Component
import TechDialog from '../Utils/TechDialog'
import CustomerSpinner from '../Utils/CustomerSpinner'
import Checkwindow from '../Utils/Checkwindow.js'

//Tree package
import Tree from 'react-d3-tree';
import $ from 'jquery'

//FireBase
import FirebaseMg from '../Utils/FirebaseMg.js'

//Context
import UserContext from '../Contexts/UserContext'

const fbMg = new FirebaseMg()
var root = fbMg.myRef

// define the tree original position
const TREE_POS = {
  x: window.innerWidth/2,
  y: 100
}


function getNode(treeData, nodeValue) {
	var traverse = require('traverse')
	// var node;
	var node = [];
	// 對整筆data做traverse
	traverse(treeData).reduce(function (acc, x) {
	    if (this.isLeaf){
	    	if(x === nodeValue){
	    		let target_node = treeData; //從root開始往下建置路徑
	    		console.log("Get Node: ", nodeValue)
	    		// console.log(this.path)
	    		// console.log(this.path.length)

	    		//一個一個取得路徑的key, 最後一個不用所以length -1
	    		for(var i = 0; i < this.path.length-1; i++){ 
					// console.log(this.path[i])
					target_node = target_node[this.path[i]] //往下走一層
	    		}
	    		// node = target_node
	    		if(!node.includes(target_node)){
	    			node.push(target_node)
	    		}
	    		
				return false
	    	}
	    }
	});
	// console.log(node)
	return node
}

class MyTree extends Component{
	static contextType = UserContext;
	constructor(props){
		super(props)
		// var intialData = data
		this.state = {
			data: {},
			dialogStyle:{
				display: 'none',
				left: 0,
				top: 0
			},
			dgTitle: '',
			dgContext: '',
			pos_x: 0,
			pos_y: 0,
			// lightNodes: [],
			isNotRender: false,
			tree_first_g : '', //use to fix the dialog
			treeRoot: {},
			isLoading: true,
			isCheckwindowShow: false,
			selectedNodeData:{},
			hoverNodePath:""
		}
		this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
		this.onMouseOutHnadler = this.onMouseOutHnadler.bind(this)
		this.onClickHandler = this.onClickHandler.bind(this)

		//Firebase getData
		var origin_this = this
	    
	}

	componentDidMount(){
		console.log("componentDidMount:")
		this.initTreeData()



		// myRef.once('value', function (snapshot) {
	 //        //取得tree data
	 //        let data = snapshot.val()
	 //        console.log("data data:",data)

		// 	//初始化tree basic data
	 //        origin_this.setState({
	 //          data: data,
	 //          isLoading: false
	 //        })

	 //        let first_g = $(".rd3t-tree-container > svg > g:first-child")
		// 	let first_g_class = first_g.attr('class')
		// 	// console.log("first_g_class",first_g_class)
		// 	origin_this.setState({
		// 		tree_first_g: first_g_class
		// 	})

	 //    }) 
	}

	changeNodeColor(data){
  		//更改技能樹每一層的顏色
  		let treeData = data
  		console.log("changeNodeColor:", treeData)

  		treeData["nodeSvgShape"]={
  			shape: "circle",
  			shapeProps: {
  				r: 13,
  				strokeWidth: 3
  			}
  		}
		for (var index1 in treeData['children']){
			let firstGen = treeData['children'][index1]
			firstGen["nodeSvgShape"] = {
				shape: "rect",
		        shapeProps: {
		          	width: 22,
				    height: 22,
				    x: -10,
				    y: -10,
				    strokeWidth: 3,
				    transform: "rotate(45) skewX(10) skewY(10)",
		          	fill: "Moccasin",
		          	stroke: "orange"
		        }
			}
			for (var index2 in firstGen['children']){
				let secondGen = firstGen['children'][index2]
				secondGen["nodeSvgShape"] = {
					shape: "rect",
			        shapeProps: {
			          	width: 22,
					    height: 22,
					    x: -10,
					    y: -10,
				    	strokeWidth: 3,
			          	fill: "LightSkyBlue",
		          		stroke: "RoyalBlue"
			        }
				}
				for (var index3 in secondGen['children']){
					let thirdGen = secondGen['children'][index3]
					if(!thirdGen.isTech){
						thirdGen["nodeSvgShape"] = {
							shape: "circle",
					        shapeProps: {
					          	r: 12,
				    			strokeWidth: 3,
					          	fill: "white",
			            		stroke: "LimeGreen"
					        }
						}
					}
				}
			}
		}
		return treeData
  	}

	initTreeData(nodeData){

		let path = 'Trees/資管系'
		let myRef = root.child(path)

		//Construct the tree
		myRef.once('value', (snapshot) => {
	        //取得tree data
	        let data = snapshot.val()
	        console.log("data data:",data)

			//改變tree樣式
			let treeData = this.changeNodeColor(data)
			
			//初始化tree basic data
	        this.setState({
	          data: treeData,
	          isLoading: false
	        })

	        let first_g = $(".rd3t-tree-container > svg > g:first-child")
			let first_g_class = first_g.attr('class')
			// console.log("first_g_class",first_g_class)
			this.setState({
				tree_first_g: first_g_class
			})

	    }) 
	    

	}

	initUserTreeState(nodeData){
		//初始化tree的資料，讓他變成完整的tree(包含collapsed、paremt)。如果可以在其他地方取得root，就在那裡初始化，只有第一次會跑進if裡面
		let treeRoot = nodeData; //把目前節點設為root
		for(var i = 0; i< nodeData.depth; i++){
			treeRoot = treeRoot.parent //往上找真的root，
		}
		
		let path = 'Users/' + this.context.user.uid + '/treeState/資管系/state'
    	let myRef = root.child(path)

    	myRef.once('value', (snapshot) => {
    		//取得user treeState
	    	let userTreeState = snapshot.val()

	    	//遍歷每個技能
			userTreeState.forEach( (skill) =>{
				let skillStds = skill["children"]
				console.log("skillStds:", skillStds)

				//遍歷每個技能標準
				for (var i in skillStds){

					//取得某一標準在tree中的資料
					var node = getNode(treeRoot, skillStds[i]['name'])
		
					//更新樣式，因為traverse不知道為甚麼會拿到多個元素，所以用For都跑一次
					for (var index in node){
						console.log("skillStds[i]:",skillStds[i]['nodeSvgShape'])
						node[index]["nodeSvgShape"] = skillStds[i]['nodeSvgShape']
					}
					// console.log("666", node)
				}

			})
			
			this.setState({
				treeRoot : treeRoot,
				data: treeRoot
			})
    	})
		

		

	}

	getPosition(css_attr){
		// console.log('first_g_class',this.state.tree_first_g)
		let pos_pair = css_attr.substring(9).split(" ")[0].split(",")
		let pos = []
		pos["x"] = pos_pair[0].substring(1)
		pos["y"] = pos_pair[1].substring(0, pos_pair[1].length - 1)

		return pos
	}

	getScale(css_attr){
		let scale = css_attr.split(" ")[1]
		scale = scale.substring(6, scale.length-1)

		return scale
	}

	getNodePath(nodeData){
		let path = []

		let tempNode = nodeData;
		for(var i = 0; i< nodeData.depth + 1; i++){
			path.push(tempNode.name)
			if(tempNode.parent){
				tempNode = tempNode.parent
			}
		}

		return path
	}

	insertSubTree(originTree, subTree){
		console.log(subTree.nodeName)
		var node = getNode(originTree, subTree.nodeName)
		console.log("insertSubTree", node)
		for (var index in node){
			let data = JSON.parse(JSON.stringify(subTree.data))
			node[index]["children"].push(data)
		}
		console.log('insertSubTree:',node)
	}

	
	onMouseOverHandler(nodeData, evt){
		console.log("onMouseOverHandler:",nodeData)
		if(Object.keys(this.state.treeRoot).length === 0){
			this.initUserTreeState(nodeData)
		}
		
		//取得tree第一個g的座標
		let tree_g = $('.' + this.state.tree_first_g)
		let pos = this.getPosition(tree_g.attr('transform'))
		let scale = this.getScale(tree_g.attr('transform'))
		console.log("pos_x",pos.x, "pos_y", pos.y)
		console.log("scale:", scale)
		//取得節點的相對座標
		let relative_x = nodeData.x*scale
		let relative_y = nodeData.y*scale

		console.log("onMouseOverHandler",nodeData)
		//計算Dialog實際座標
		let dialog_x = parseInt(pos.x, 10) + relative_x
		let dialog_y = parseInt(pos.y, 10) + relative_y
		console.log("Evt", evt.clientX, evt.clientY)

		console.log("onMouseOverHandler", "dialog_x:", dialog_x, "dialog_y:", dialog_y)
		if(nodeData.isTech || nodeData.hasDialog){

			//get the hover path
			let path = this.getNodePath(nodeData)
			console.log("!!!",path)

			this.setState({
				dialogStyle: {
					display: 'block',
					left: dialog_x,
					top: dialog_y
				},
				dgTitle: nodeData.name,
				dgContext: nodeData.context,
				pos_x: dialog_x,
				pos_y: dialog_y,
				hoverNodePath:path
				// isOpen: false
			})
		}
		
	}

	onMouseOutHnadler(nodeData, evt){
		let out_x = evt.clientX
		let out_y = evt.clientY
		let boundary_x = this.state.pos_x - 1
		let boundary_y = this.state.pos_y - 1
		if(out_x < boundary_x || out_y < boundary_y){
			this.setState({
				dialogStyle: {
					display: 'none',
					left: 0,
					top: 0
				},
				// isNotRender: false
			})
		}
		console.log("onMouseOutHnadler,", "out_x:", out_x, "out_y", out_y)
		console.log("onMouseOutHnadler:", this.state.isNotRender)
		// console.log(out_x, out_y)
		// console.log(boundary_x, boundary_y)
	}

	onClickHandler(nodeData, evt){
		
		// console.log("OnClick:", nodeData)
		var selector = "#" + nodeData.id + " circle"
		var $node = $(selector)
		
		if(nodeData.isTech){
			this.popCheckWindow()
			this.setState({
				selectedNodeData:nodeData
			})
			
		}
	}

	popCheckWindow(){
		this.setState({
			isCheckwindowShow: true
		})		
	}

	updateNodeColor(color){
		let nodePath = this.state.hoverNodePath
		let skillName = nodePath[1]
		let skillStd = nodePath[0]

		let path = "Users/" + this.context.user.uid + "/treeState/" + "資管系" + "/state"
    	let myRef = root.child(path)

    	myRef.once('value', (snapshot) => {
			let data = snapshot.val()
			let path1 = 666 
			let path2 = 666
			let skillNode = []

			data.forEach( (skill, index) =>{
				
				if(skill["name"] === skillName){
					path1 = index

					skill["children"].forEach( (std, index) =>{
						if(std["name"] === skillStd){
							path2 = index
						}
					})
				}
			})

			path = path + "/" + path1 + "/children/" + path2 + "/nodeSvgShape/shapeProps"
			myRef = root.child(path)
			myRef.update({"fill": color})
				

    	}).then( (result) => {
    		return myRef
    	}).catch( (failureCallback) =>{
			// console.log("failureCallback:",failureCallback)
    	});
	}

	updateProgress(){
		let nodePath = this.state.hoverNodePath
		let skillName = nodePath[1]
		let skillStd = nodePath[0]
		let childrenLength = this.state.selectedNodeData["parent"]["children"].length
		
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
				childrenData[completedNum] = skillStd
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
						0: skillStd
					},
					"completed": 1/childrenLength
				}
				myRef.update(progressData)
			}

    	}).then((result)=>{

    	})

	}

	handleConfirm = () =>{
		if(this.state.selectedNodeData["nodeSvgShape"]["shapeProps"]["fill"] === "yellow"){
			alert("此技能已點亮，不需要再次點亮喔!")
		}else{
			this.updateNodeColor("yellow") //for treeState
			this.updateProgress() //for progress

			let nodeData = this.state.selectedNodeData
			let root = nodeData; //把目前節點設為root

			//不能直接用this.state.data當作tree,因為它其實有許多資料沒有寫完整 Ex : collapse...
			for(var i = 0; i< nodeData.depth; i++){
				root = root.parent //往上找真的root
			}

			// console.log("onClickHandler root:", root)
			let treeData = root //把root當作修改的資料

			/*實作insert node功能，待討論格式、如何指定Tree*/
			// this.insertSubTree(treeData, subTreeData)
			
			var node = getNode(treeData, nodeData.name)
			// node = node["nodeSvgShape"]["shapeProps"]["fill"] = 'yellow'

			for (var index in node){
				node[index]["nodeSvgShape"] = {
					shape: "circle",
			        shapeProps: {
			          r: 10,
			          fill: "yellow",
			          stroke: "OrangeRed"
			        }
				}
			}

			this.setState({
				data: treeData,
				isCheckwindowShow: false	
			})			
		}

	}

	cancelSkillNode(){
		let nodePath = this.state.hoverNodePath
		let skillName = nodePath[1]
		let skillStd = nodePath[0]
		let childrenLength = this.state.selectedNodeData["parent"]["children"].length
		
		let path = "Users/" + this.context.user.uid + "/progress/" + skillName
    	let myRef = root.child(path)


    	myRef.once('value', (snapshot)=>{
    		let data = snapshot.val()

    		//update children
	    	let remainData = []
	    	let childrenData = new Object()

    		data["children"].forEach((child, index)=>{
    			if(child !== skillStd){
					remainData.push(child)
    			}
    		})

    		remainData.forEach((child, index)=>{
    			childrenData[index] = child
    		})

			//update progress
    		let progress = data['completed']
    		progress = progress - 1/childrenLength

    		//例外處理，如果把所有節點取消，刪除整個技能節點資料
    		if(progress <= 0.05){
    			myRef.remove()
    		}else{
 	    		myRef.update({
	    			"children":childrenData,
					"completed":progress
	    		})   			
    		}




    	})
	}

	handleCancel = () =>{
		if(this.state.selectedNodeData["nodeSvgShape"]["shapeProps"]["fill"] === "white"){
			alert("此技能本來就未點亮!")
		}else{
			this.updateNodeColor("white") //for treeState
			this.cancelSkillNode() //for progress
			
			let nodeData = this.state.selectedNodeData
			let root = nodeData; //把目前節點設為root
			for(var i = 0; i< nodeData.depth; i++){
				root = root.parent //往上找真的root
			}

			let treeData = root //把root當作修改的資料
			var node = getNode(treeData, nodeData.name) //取得目前節點位置
			for (var index in node){
				node[index]["nodeSvgShape"] = {
					shape: "circle",
			        shapeProps: {
			          r: 10,
			          fill: "white"
			        }
				}
			}
				
			console.log('onClickHandler treeData', treeData)
			this.setState({
				data: treeData
			})
			this.setState({
				isCheckwindowShow: false
			})			
		}

		
	}

	render() {
		let treeData = this.state.data
		console.log("Render:", treeData)
		if(this.state.isLoading){
			return <CustomerSpinner />
		}else {
			return (
				<div className="MyTree custom-container">
			      <Tree
			        data= {this.state.data}
			        orientation="vertical"
			        nodeSize={
			          {x: 140, y: 140}
			        }
			        pathFunc={"step"}
			        depthFactor={170}
			        separation={
			          {siblings: 1.2, nonSiblings: 1.2}
			        }
			        initialDepth={1}
			        scaleExtent={
			          {min: 1, max: 2}
			        }

			        textLayout={
			          {textAnchor: "middle", x: 0, y: -20, transform: undefined }
			        }
			        translate={
			          {x:TREE_POS.x + 10, y: TREE_POS.y + 20}
			        }
			        onMouseOver = {this.onMouseOverHandler}
			        onMouseOut = {this.onMouseOutHnadler}
			        onClick = {this.onClickHandler}
			        transitionDuration={1}/>
	            
			      <TechDialog
			      	title={this.state.dgTitle}
			      	context={this.state.dgContext}
			      	style={this.state.dialogStyle}
			      	path={this.state.hoverNodePath}/>
			      	
			      <Checkwindow
			      	isShow={this.state.isCheckwindowShow}
					handleConfirm={this.handleConfirm}
					handleCancel={this.handleCancel}
			      	/>
			    </div>
			);			
		}

	}
}


export default MyTree;
import React, {Component} from 'react';
import './MyTree.css';
import TechDialog from './TechDialog'
import Tree from 'react-d3-tree';
// import pyTreeData from '../Database/talent tree.json'
// import treeDatas from '../Database/PythonTree.json'
import $ from 'jquery'

// define the tree original position
const TREE_POS = {
  x: window.innerWidth/2,
  y: 50
}

// let data = pyTreeData

function getNode(treeData, nodeValue) {
	var traverse = require('traverse')

	var node;
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
	    		node = target_node
				return false
	    	}
	    }
	});
	// console.log(node)
	return node
}

class MyTree extends Component{
	constructor(props){
		super(props)
		var intialData = props.data
		this.state = {
			data: intialData,
			dialogStyle:{
				display: 'none',
				left: 0,
				top: 0
			},
			dgTitle: '',
			dgContext: '',
			pos_x: 0,
			pos_y: 0,
			lightNodes: [],
			isNotRender: false
		}
		this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
		this.onMouseOutHnadler = this.onMouseOutHnadler.bind(this)
		this.onClickHandler = this.onClickHandler.bind(this)
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log('shouldComponentUpdate', nextState.isNotRender)
	//     if (nextState.isNotRender) {
	// 	      return false;
	// 	    }
	// 	return true;
	// }
	
	onMouseOverHandler(nodeData, evt){
		console.log("onMouseOverHandler",nodeData)
		let dialog_x = evt.clientX
		let dialog_y = evt.clientY
		console.log("onMouseOverHandler", "dialog_x:", dialog_x, "dialog_y:", dialog_y)
		if(nodeData.isTech){
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
			let isConfirm = window.confirm("確定點亮技能樹?")
			if(isConfirm){

				// $node.attr({
				// 	"fill": "yellow"
				// })

				let root = nodeData; //把目前節點設為root
				for(var i = 0; i< nodeData.depth; i++){
					root = root.parent //往上找真的root
				}

				// console.log("onClickHandler root:", root)
				let treeData = root //把root當作修改的資料
				
				console.log('onClickHandler treeData', this.state.data)
				var node = getNode(treeData, nodeData.name)
				// node = node["nodeSvgShape"]["shapeProps"]["fill"] = 'yellow'
				node["nodeSvgShape"] = {
					shape: "circle",
			        shapeProps: {
			          r: 10,
			          fill: "yellow"
			        }
				}
				
				// node["nodeSvgShape"]["shapeProps"]["fill"] = "yellow"
				// console.log(node)
				console.log('onClickHandler treeData', treeData)
				console.log('onClickHandler treeData', this.state.data)
				this.setState({
					// lightNodes: nodes
					// isNotRender: true,
					data: treeData
					
				})
				console.log('onClickHandler treeData', this.state.data)
				// console.log('this.state.data:', this.state.data)
			}else {
				// $node.attr({
				// 	"fill": "none"
				// })

				let root = nodeData; //把目前節點設為root
				for(var i = 0; i< nodeData.depth; i++){
					root = root.parent //往上找真的root
				}

				let treeData = root //把root當作修改的資料
				var node = getNode(treeData, nodeData.name) //取得目前節點位置
				node["nodeSvgShape"] = { //修改節點
					shape: "circle",
			        shapeProps: {
			          r: 10,
			          fill: "none"
			        }
				}
					
				console.log('onClickHandler treeData', treeData)
				this.setState({
					data: treeData
				})
			}
		}
	}

	// modalToggle(){
	// 	this.setState({
	// 		isOpen: !this.state.isOpen
	// 	})
	// 	console.log(this.state.isOpen)
	// }

	render() {
		let treeData = this.state.data
		console.log("Render:", treeData)
		this.state.lightNodes.forEach(function(val, index){
			console.log("Render node:",val)
			val.attr({
				"fill": "yellow"
			})
		})
		return (
			<div className="custom-container">
		      <Tree
		        data= {treeData}
		        orientation="vertical"
		        nodeSize={
		          {x: 140, y: 140}
		        }
		        separation={
		          {siblings: 1, nonSiblings: 1}
		        }
		        initialDepth={1}
		        scaleExtent={
		          {min: 1, max: 2}
		        }

		        textLayout={
		          {textAnchor: "middle", x: 0, y: -20, transform: undefined }
		        }
		        translate={
		          {x:TREE_POS.x, y: TREE_POS.y}
		        }
		        onMouseOver = {this.onMouseOverHandler}
		        onMouseOut = {this.onMouseOutHnadler}
		        onClick = {this.onClickHandler}
		        transitionDuration={1}/>
            
		      <TechDialog 
		      	title={this.state.dgTitle}
		      	context={this.state.dgContext}
		      	style={this.state.dialogStyle}/>
		    </div>
		);
	}
}


export default MyTree;
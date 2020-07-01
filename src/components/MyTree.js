import React, {Component} from 'react';
import './MyTree.css';
import TechDialog from './TechDialog'
import Tree from 'react-d3-tree';
// import pyTreeData from '../Database/talent tree.json'
// import treeDatas from '../Database/PythonTree.json'
import $ from 'jquery'
import subTreeData from '../Database/subTree.json'
import userState from '../Database/userState.json'

// define the tree original position
const TREE_POS = {
  x: window.innerWidth/2,
  y: 100
}


// let data = pyTreeData

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
			// lightNodes: [],
			isNotRender: false,
			tree_first_g : '', //use to fix the dialog
			treeRoot: {}
		}
		this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
		this.onMouseOutHnadler = this.onMouseOutHnadler.bind(this)
		this.onClickHandler = this.onClickHandler.bind(this)
	}

	componentDidMount() {
		console.log('componentDidMount')
		let first_g = $(".rd3t-tree-container > svg > g:first-child")
		let first_g_class = first_g.attr('class')
		// console.log(first_g_class, typeof(first_g_class))
		this.setState({
			tree_first_g: first_g_class
		})
		// console.log("userState",userState['state'])
  	}
	


	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log('shouldComponentUpdate', nextState.isNotRender)
	//     if (nextState.isNotRender) {
	// 	      return false;
	// 	    }
	// 	return true;
	// }

	// getTreePos(tree_g_class){
	// 	let tree_g = $('.' + tree_g_class).
	// }

	getPosition(css_attr){
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
	
		//初始化root
		//初始化state。如果可以在其他地方取得root，就在那裡初始化state
		if(Object.keys(this.state.treeRoot).length === 0){
			let root = nodeData; //把目前節點設為root
			for(var i = 0; i< nodeData.depth; i++){
				root = root.parent //往上找真的root
			}
			for (var i in userState['state']){
			// console.log(userState['state'][i])
				var node = getNode(root, userState['state'][i]['name'])
				// console.log("666", node)
	
				for (var index in node){
					node[index]["nodeSvgShape"] = userState['state'][i]['nodeSvgShape']
				}
				// console.log("666", node)
			}
			this.setState({
				treeRoot : root,
				data: root
			})
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

				/*實作insert node功能，待討論格式、如何指定Tree*/
				// this.insertSubTree(treeData, subTreeData)
				
				console.log('onClickHandler treeData', this.state.data)
				var node = getNode(treeData, nodeData.name)
				// node = node["nodeSvgShape"]["shapeProps"]["fill"] = 'yellow'
				console.log("NNNNNNNN",node)
				for (var index in node){
					node[index]["nodeSvgShape"] = {
						shape: "circle",
				        shapeProps: {
				          r: 10,
				          fill: "yellow"
				        }
					}
				}

				// nodeD["nodeSvgShape"] = {
				// 	shape: "circle",
			 //        shapeProps: {
			 //          r: 10,
			 //          fill: "yellow"
			 //        }
				// }
				
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
				for (var index in node){
					node[index]["nodeSvgShape"] = {
						shape: "circle",
				        shapeProps: {
				          r: 10,
				          fill: "white"
				        }
					}
				}
				// node["nodeSvgShape"] = { //修改節點
				// 	shape: "circle",
			 //        shapeProps: {
			 //          r: 10,
			 //          fill: "none"
			 //        }
				// }
					
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
		// this.state.lightNodes.forEach(function(val, index){
		// 	console.log("Render node:",val)
		// 	val.attr({
		// 		"fill": "yellow"
		// 	})
		// })
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
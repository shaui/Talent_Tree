import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import FirebaseMg from '../Utils/FirebaseMg.js';
import './CustomBreadcrumb.css'

import routes from '../Database/routes.json' ;

// function insertNameByParams(path, params, isActive) {
//   let item ;

//   if ( path === "/forum" ) {
//     let pathObj = new Object() 
//     if ( Array.isArray(params) ) {
//       if ( params.length === 4 ) {
//         pathObj.subject = params[3]
//         pathObj.field = params[2]
//         pathObj.skill = params[1]
//         pathObj.subskill = params[0]
//       }
//       else {
//         pathObj.subject = params[4]
//         pathObj.field = params[3]
//         pathObj.skill = params[2]
//         pathObj.subskill = params[1]
//         pathObj.standard = params[0]
//       }
//     } 
//     else {
//       if ( typeof params === "string" ) {
//         pathObj.subskill = params
//         const fbMg = new FirebaseMg() ;
//         var root = fbMg.myRef.child('Trees') ;
//         var node = 'Trees' ;
//         var myRef = root.child(node) ;
//         myRef.once('value').then( (snapshot) => {
//           let treeData = snapshot.val() ;
//           var traverse = require('traverse') ;
          
//           traverse(treeData).forEach(function (x) {
//               if (x === params) {
//                 pathObj.skill = this.parent.parent.parent.node.name
//                 pathObj.field = this.parent.parent.parent.parent.parent.node.name
//                 pathObj.subject = this.parent.parent.parent.parent.parent.parent.parent.node.name
//               }
//           });
          
          
//         } )
//         .catch( (error) => {
//           console.log(error) ;
//         } ) ;
//       }
//       else {
//         pathObj.subject = "資管系"
//         pathObj.field = "系統規劃"
//         pathObj.skill = "JAVA"
//         pathObj.subskill = "JAVA 1級"
//       }
//     }
    
//     item = isActive ? 
//       <Breadcrumb.Item active>{pathObj.subskill}</Breadcrumb.Item> : 
//       <Breadcrumb.Item href={path} >
//         <Link to={{
//              pathname:'/forum/post',
//              state: {
//               params: params }
//         }}> 
//           {pathObj.subskill}
//         </Link>
//       </Breadcrumb.Item>

//   }
//   else if ( path === "/course" ) {
    
//   }
  
// }

function segmentsToItems(segments, params) {
  let items = [];
  let routesObj = JSON.parse(JSON.stringify(routes))
  const isRoot = segments.every( (segment) => 
    segment === ""
  )
  for ( let i = 0 ; i < (isRoot ? segments.length-1 : segments.length) ; i ++ ) {
    let href = ""
    for ( let depth = 0 ; depth <= i ; depth ++ ) {
      href = href + segments[depth] + "/"
    }
    let item = ( i === segments.length-1 ) ? 
      <Breadcrumb.Item active>{routesObj.breadcrumbName}</Breadcrumb.Item> :
      <Breadcrumb.Item href={href} >{routesObj.breadcrumbName}</Breadcrumb.Item>
    items.push(item)
    
    if ( routesObj.routes ) {
      routesObj = routesObj.routes.find( ( route ) => {
        return route.segment === segments[i+1]
      } )
    }
    
  }
  return items ;
}

function CustomBreadcrumb(props) {
    const path = props.path
    const params = props.params
    const segments = path.split('/')
    let items ;
    if ( segments.length === 1 )
      items = <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
    else
      items = segmentsToItems( segments, params ) ;
    

    return (
      <Breadcrumb>
        { items }
      </Breadcrumb>
    )

}

export default CustomBreadcrumb;
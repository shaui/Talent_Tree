import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import FirebaseMg from '../Utils/FirebaseMg.js';
import './CustomBreadcrumb.css'

import routes from '../Database/routes.json' ;

function insertNameByParams(href, paramsString, isActive) {
  let item ;
  const segments = href.split('/')
  const segment = segments[segments.length-1]
  console.log(segment);

  if ( segment === "forum" ) {
    
    let params ;
    if ( paramsString )
      params = paramsString.split(',')
    else
      params = "" ;
    
    let pathObj = new Object() 
    if ( params.length === 4 ) {
      pathObj.subject = params[3]
      pathObj.field = params[2]
      pathObj.skill = params[1]
      pathObj.subskill = params[0]
    }
    else if ( params.length === 5 ) {
      pathObj.subject = params[4]
      pathObj.field = params[3]
      pathObj.skill = params[2]
      pathObj.subskill = params[1]
      pathObj.standard = params[0]
    }
    else if ( params.length === 1 ) {
      pathObj.subskill = params[0]
    }
    else {
      pathObj.subject = "資管系"
      pathObj.field = "系統規劃"
      pathObj.skill = "JAVA"
      pathObj.subskill = "JAVA 1級"
      isActive = true
    }
    
    item = isActive ? 
      <Breadcrumb.Item active>{pathObj.subskill}</Breadcrumb.Item> : 
      <Breadcrumb.Item href={href+"/"+params}>{pathObj.subskill}</Breadcrumb.Item>

  }
  else if ( segment === "course" ) {
    let params ;
    if ( paramsString )
      params = paramsString.split('&')
    else
      params = "" ;
    item = isActive ? 
      <Breadcrumb.Item active>{params[1]}</Breadcrumb.Item> : 
      <Breadcrumb.Item href={href+"/"+params}>{params[1]}</Breadcrumb.Item>
  }
  
  return item

}

function segmentsToItems(segments) {
  let items = [];
  let routesObj = JSON.parse(JSON.stringify(routes))
  
  const isRoot = segments.every( (segment) => 
    segment === ""
  )
  for ( let i = 0 ; i < (isRoot ? segments.length-1 : segments.length) ; i ++ ) {
      let href = ""
      // 製作href的loop，每個頁面都要有一個ref，所以愈接愈長
      for ( let depth = 0 ; depth <= i ; depth ++ ) {

          if( depth === i && i !== 0 ){ //硬要，避免href最後有"/"
            href = href + segments[depth]
          } else {
            href = href + segments[depth] + "/"
          }

      }
      
      if ( routesObj.hasParams === true ) {
        let item = ( i+1 === segments.length-1 ) ? 
            insertNameByParams(href, segments[i+1], true) :
            insertNameByParams(href, segments[i+1], false)
        items.push(item)
        i++ ; // 跳過傳遞參數那個segment的迴圈
      }
      else {
        let item = ( i === segments.length-1 ) ? 
            <Breadcrumb.Item active>{routesObj.breadcrumbName}</Breadcrumb.Item> :
            <Breadcrumb.Item href={href} >{routesObj.breadcrumbName}</Breadcrumb.Item>
        items.push(item)
      }
      
      // 讀取的routes json往下一層
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
    const segments = path.split('/')
    let items ;

    items = segmentsToItems( segments ) ;
    

    return (
      <Breadcrumb>
        { items }
      </Breadcrumb>
    )

}

export default CustomBreadcrumb;
import React, {Component} from 'react';
import {Container,Row,Col,Card,Button} from 'react-bootstrap';
import './TreeMenu.css'
import PropTypes from 'prop-types';
import FirebaseMg from '../Utils/FirebaseMg.js'

const fbMg = new FirebaseMg()
var root = fbMg.myRef
var path = 'TreeMenu'
var myRef = root.child(path)

class TreeData extends Component{
    static propTypes ={
        data:PropTypes.object
    }
    render(){
        const{data}=this.props;
        return(
            <Card className="TreeMenu menuCard">
                <Card.Img variant="top" src={data.img} className="TreeMenu card-image"></Card.Img>
                <Card.Body>

                    <div><Card.Title>{data.title}</Card.Title></div>
                    <div><Card.Text>{data.info}</Card.Text></div>
                    
                    <div>
                    {
                        data.tag.map(content =>(
                            <span className='TreeMenu tag'>{content}</span>
                        ))
                        
                    }
                    <span><Card.Link className='TreeMenu right' href={data.link}>前往技能樹</Card.Link></span>
                    </div>
                </Card.Body>
                
            </Card>
        )
    }
}

class TreeMenu extends Component{
    state={
        data:[]
    }
    componentDidMount(){
        myRef.once('value').then( (snapshot) => {
            let data = snapshot.val()
            console.log("data data:",data)
            this.setState({
                data:data
            })
        })
        
    }
    render(){
        const{data}=this.state;
        const treemenu=data.map(content =>(
            <Col xs={12} md={6} lg={6} style={{'margin-top':'10px'}}>
                <TreeData
                    data={content}
                />
            </Col>
        ));
        
        
        return(
            <div className="TreeMenu content" style={{'margin-top':'100px'}}>
                <Container>
                    <Row>{treemenu}</Row>
                </Container>
            </div>
        )


    }
}

export default TreeMenu;
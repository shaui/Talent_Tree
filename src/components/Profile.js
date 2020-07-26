import React, {Component} from 'react';
import {Container,Row,Col,Card,Button,Carousel} from 'react-bootstrap';
import FirebaseMg from '../Utils/FirebaseMg.js'

import './Profile.css'

const fbMg = new FirebaseMg()

var root = fbMg.myRef
var path = 'Users/userID'
var myRef= root.child(path)




class Profile extends Component{
    constructor(props,username){
        super(props)
        this.state={
            data:[],
            user:username
        }
    }

    componentDidMount(){
        myRef.once('value').then( (snapshot) => {
            let data = snapshot.val()
            console.log("data:",data)
            console.log("data:",data.treeState)
            // console.log("myRef:",myRef)
            this.setState({
                data:data
            })
        })

    }

    getHistory(){
        var list=[];

        var history = this.state.data.history;
        for(var i in history){
            let history_data=[];
            history[i].map((content,index)=>(
                history_data.push(
                    <div key={content}>
                        <span>{content.time}</span>
                        <span style={{'marginLeft':'18pt'}}>學會了{content.name}</span>
                    </div>
                )
            ))
            list.push(
                <Carousel.Item>
                    <div><h3>{i}</h3></div>
                    <div style={{'marginLeft':'5%'}}>{history_data}</div>
                </Carousel.Item>
            )

        }
        return list;
    }
    getArtwork(){
        var list=[];
        var artwork = this.state.data.artwork;
        if (!artwork){
            list.push(
                <div>還沒有任何學習成果唷</div>
            )
        }
        return list;
    }
    getActivities(){
        var list=[];
        var activities = this.state.data.activities;

        if (!activities){
            list.push(
                <div>還沒有任何活動事蹟唷</div>
            )
        }
        return list;
    }
    render(){
        const{data}=this.state;
        const history=this.getHistory();
        const artwork=this.getArtwork();
        const activities=this.getActivities();
        return(
            <div className='Profile content'>
                <Card className='border-0'>
                    <div className='Profile userInfo'>
                        <div>
                            <h1>
                                <span><i class="fa fa-user-circle-o" style={{'font-size':'32px'}}></i></span>
                                <span className='Profile Card_Title'>個人資料</span>
                                <span><i class="fa fa-pencil Profile icon" ></i></span>
                            </h1>
                        </div>
                        <div className='Profile divider'></div>
                        <div>姓名：{data.name}</div>
                    </div>
                </Card>
                <Card className='border-0'>
                    <div className='Profile userInfo'>
                        <div>
                            <h1>
                                <span><i class="fa fa-mortar-board" style={{'font-size':'32px'}}></i></span>
                                <span className='Profile Card_Title'>學習歷程</span>
                                <span>
                                    <i class="fa fa-toggle-right Profile icon"></i>
                                    <i class="fa fa-toggle-left Profile icon"></i>
                                </span>
                            </h1>
                        </div>
                        <div className='Profile divider'></div>
                        <div>
                            <Carousel prevIcon={<span className="fa fa-toggle-left Profile icon2"></span>} nextIcon={<span className="fa fa-toggle-right Profile icon2"></span>} interval={null} indicators={false} style={{'height':'40vh'}}>{history}</Carousel>

                        </div>
                    </div>
                </Card>

                <Card className='border-0'>
                    <div className='Profile userInfo'>
                        <div>
                            <h1>
                                <span><i class="fa fa-folder" style={{'font-size':'32px'}}></i></span>
                                <span className='Profile Card_Title'>學習成果</span>
                                <span>
                                    <i class="fa fa-pencil Profile icon"></i>
                                    <i class="fa fa-plus Profile icon"></i>
                                </span>
                            </h1>
                        </div>
                        <div className='Profile divider'></div>
                        <div><Card.Text>
                            {artwork}
                        </Card.Text></div>
                    </div>
                </Card>

                <Card className='border-0'>
                    <div className='Profile userInfo'>
                        <div>
                            <h1>
                                <span><i class="fa fa-flask" style={{'font-size':'32px'}}></i></span>
                                <span className='Profile Card_Title'>活動事蹟</span>
                                <span>
                                    <i class="fa fa-pencil Profile icon"></i>
                                    <i class="fa fa-plus Profile icon"></i>
                                </span>
                            </h1>
                        </div>
                        <div className='Profile divider'></div>
                        <div><Card.Text>
                            {activities}
                        </Card.Text></div>
                    </div>
                </Card>
            </div>



        )
    }
}


export default Profile;
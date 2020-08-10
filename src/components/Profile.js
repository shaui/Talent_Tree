import React, {Component} from 'react';
import {Container,Row,Col,Card,Button,Carousel,Modal} from 'react-bootstrap';
import FirebaseMg from '../Utils/FirebaseMg.js'
import Switch from '@material-ui/core/Switch'

import './Profile.css'

const fbMg = new FirebaseMg()

var root = fbMg.myRef
var uuid=''
class Profile extends Component{
    constructor(props,username){
        super(props)
        this.state={
            data:[],
            user:username,
            index:0,
            direction:null,
            isShowArtwork:false,
            isShowActivities:false,
            isProfileEdited:false,
            isPublic:false
        }

    }

    componentDidMount(){
        fbMg.auth.onAuthStateChanged(userAuth=>{
            uuid=userAuth.uid
            let myRef=root.child('Users/'+uuid)
            myRef.on('value',(snapshot) => {
                let data = snapshot.val()
                console.log("data:",data)
                console.log("data:",data.treeState)
                // console.log("myRef:",myRef)
                this.setState({
                    data:data,
                    isPublic:data.isPublic
                })
            })
        })


    }

    getHistory (){
        var list=[];
        var history = this.state.data.history;
        if(!history){
            list.push(
                <div key='x' className="text-center" style={{'marginTop':'10%','color':'grey'}}>尚未取得任何技能唷！</div>
            )
        }
        else{

            for(var i in history){
                let history_data=[];
                history[i].map((content)=>(
                    history_data.push(
                        <div key={content}>
                            <span>{content.time}</span>
                            <span style={{'marginLeft':'18pt'}}>學會了{content.name}</span>
                        </div>
                    )
                ))
                list.push(
                    <Carousel.Item key={i}>
                        <div><h3>{i}</h3></div>
                        <div style={{'marginLeft':'5%'}}>{history_data}</div>
                    </Carousel.Item>
                )

            }


        }

        return list;
    }
    toggleCarousel = (direction) => {
        let index = this.state.index
        const [min, max] = [0, Object.keys(this.state.data.history).length - 1]

        if (direction === 'next') {
          index++
        }
        else if (direction === 'prev') {
          index--
        }

        if (index > max) {
          // at max, start from top
          index = 0
        }

        if (index < min) {
          // at min, start from max
          index = max
        }
        this.setState({
          direction,
          index
        })

      }
    getArtwork(){
        var list=[];
        var artwork = this.state.data.artwork;

        if (!artwork){
            list.push(
                <div key='x' className="text-center" style={{'marginTop':'10%','color':'grey'}}>尚未上傳任何學習成果唷！</div>
            )
        }
        else{
            artwork.map((content,index)=>(

                list.push(
                    <Row style={{'marginBottom':'16pt'}} className="artwork" id={index}>
                        {
                            content.link
                            ? <Col xs={12} md={4} lg={4} style={{'maxWidth':'25%'}}><li><a  href={content.link}>{content.name}</a></li></Col>
                            : <Col xs={12} md={4} lg={4} style={{'maxWidth':'25%'}}><li>{content.name}</li></Col>
                        }

                        <Col xs={11} md={8} lg={8}>{content.description}</Col>
                        <Col xs={1} md={1} lg={1}><i className="fa fa-close Profile icon" style={{'fontSize':'24px'}} onClick={()=>this.deleteArtwork(index)} ></i></Col>
                    </Row>
                )


            ))
        }

        return list;
    }
    getActivities(){
        var list=[];
        var activities = this.state.data.activities;

        if (!activities){
            list.push(
                <div key='x' className="text-center" style={{'marginTop':'10%','color':'grey'}}>尚未上傳任何活動事蹟唷！</div>
            )
        }
        else{
            activities.map((content,index)=>(

                list.push(
                    <Row style={{'marginBottom':'16pt'}} className="activities" id={index}>
                        <Col xs={3} md={3} lg={3}><li>{content.time}</li></Col>
                        <Col xs={8} md={8} lg={8}>{content.description}</Col>
                        <Col xs={1} md={1} lg={1}><i className="fa fa-close Profile icon" style={{'fontSize':'24px'}} onClick={()=>this.deleteActivities(index)}></i></Col>
                    </Row>
                )

            ))
        }
        return list;
    }
    handleClose=(name,data)=>{

        if(name==="artwork"){

            if(Object.keys(data).length>0){
                if(data.name.replace(/(^s*)|(s*$)/g, "").length>0 && data.description.replace(/(^s*)|(s*$)/g, "").length>0){
                    this.pushArtwork(data.name,data.description,data.link)
                    alert("上傳成功")
                    this.setState({
                        isShowArtwork:false
                    })
                }
                else{
                    alert("請正確填寫資料")
                }

            }
            else{
                this.setState({
                    isShowArtwork:false
                })
            }
        }
        else if(name==="activities"){
            if(Object.keys(data).length>0){
                if(data.time.replace(/(^s*)|(s*$)/g, "").length>0 && data.description.replace(/(^s*)|(s*$)/g, "").length>0){
                    this.pushActivities(data.time,data.description)
                    alert("上傳成功")
                    this.setState({
                        isShowActivities:false
                    })
                }
                else{
                    alert("請正確填寫資料")
                }

            }
            else{
                this.setState({
                    isShowActivities:false
                })
            }

        }


    }
    handleShow=(name)=>{
        if(name==="artwork"){
            this.setState({
                isShowArtwork:true
            })
        }
        else if(name==="activities"){
            this.setState({
                isShowActivities:true
            })
        }
        else{
            return false;
        }
    }

    handleChange = (event) =>{
        var initdata={isPublic:event.target.checked}
        let myRef=root.child('Users/'+uuid)
        myRef.update(initdata)
        this.setState({
            isPublic:event.target.checked
        })

    }
    pushArtwork(name,description,link){

        var initdata={
            name:name,
            description:description,
            link:link
        }
        var insertNode = root.child('Users/'+uuid+'/artwork/'+this.state.data.artwork.length)
        insertNode.update(initdata)

    }
    pushActivities(time,description){

        var initdata={
            time:time,
            description:description
        }
        var insertNode = root.child('Users/'+uuid+'/activities/'+this.state.data.activities.length)
        insertNode.update(initdata)

    }
    deleteArtwork(id){
        var deleteNode=root.child('Users/'+uuid+'/artwork/'+id)


            deleteNode.remove()
            alert("刪除成功")


    }
    deleteActivities(id){
        var deleteNode=root.child('Users/'+uuid+'/activities/'+id)


            deleteNode.remove()
            alert("刪除成功")


    }

    handleEdited(type){
        if(type==="Profile"){
            this.setState({
                isProfileEdited:true
            })
        }
    }

    updateProfile(){
        var name=document.getElementById("name").value
        var birthday=document.getElementById("birthday").value
        var email=document.getElementById("email").value
        var phone=document.getElementById("phone").value
        var LinkedIn=document.getElementById("LinkedIn").value
        var github=document.getElementById("github").value
        var facebook=document.getElementById("facebook").value
        var data={
            name:name,
            birthday:birthday,
            email:email,
            phone:phone,
            LinkedIn:LinkedIn,
            github:github,
            facebook:facebook
        }


        for(var i in data){
            if(data[i].length<=0){
                data[i]=document.getElementById(i).placeholder
            }
        }
        root.child('Users/'+uuid).update(data)
        alert("上傳成功")
        this.setState({
            isProfileEdited:false
        })
    }
    clearPlaceholder(type){
        if(type==="LinkedIn"){
            document.getElementById("LinkedIn").placeholder=""
        }
        if(type==="github"){
            document.getElementById("github").placeholder=""
        }
        if(type==="facebook"){
            document.getElementById("facebook").placeholder=""
        }
    }


    render(){
        const{data}=this.state;
        // const history=this.getHistory();
        const artwork=this.getArtwork();
        const activities=this.getActivities();
        if(uuid.length>0){
            return(
                <div className='Profile content'>
                    <Card className='border-0'>

                        <div className='Profile userInfo'>
                            <div>
                                <h1>
                                    <span><i className="fa fa-user-circle-o" style={{'fontSize':'32px'}}></i></span>
                                    <span className='Profile Card_Title'>個人資料</span>
                                    <span><i className="fa fa-pencil Profile icon" onClick={()=>this.handleEdited("Profile")} ></i></span>
                                </h1>
                            </div>
                            <div className='Profile divider'></div>
                            {
                                this.state.isProfileEdited
                                ?   <div>
                                        <Row>
                                            <Col>姓名：<input type="input" className="Profile EditBar" id="name" placeholder={data.name} ></input> </Col>
                                            <Col>生日：<input type="input" className="Profile EditBar" id="birthday" placeholder={data.birthday}></input></Col>
                                        </Row>
                                        <Row>
                                            <Col>信箱：<input type="input" className="Profile EditBar" id="email" placeholder={data.email} ></input></Col>
                                            <Col>電話：<input type="input" className="Profile EditBar" id="phone" placeholder={data.phone} ></input></Col>
                                        </Row>
                                        <Row style={{'marginBottom':'3vh'}}><Col >個人頁面：</Col></Row>
                                        <Row>
                                            <Col>
                                                <Col>
                                                    <i className="fa fa-linkedin-square" style={{'fontSize':'32px','color':'#007bff'}} ></i>
                                                    <input type="input" className="Profile EditBar" id="LinkedIn" placeholder={data.LinkedIn} style={{'marginLeft':'1vw','width':'75%'}}></input>
                                                    <i className="fa fa-close Profile iconBtn"  onClick={()=>this.clearPlaceholder("LinkedIn")}></i>
                                                </Col>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Col>
                                                    <i className="fa fa-github" style={{'fontSize':'32px','color':'#007bff'}} ></i>
                                                    <input type="input" className="Profile EditBar" id="github" placeholder={data.github} style={{'marginLeft':'1vw','width':'75%'}}></input>
                                                    <i className="fa fa-close Profile iconBtn"  onClick={()=>this.clearPlaceholder("github")}></i>
                                                </Col>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Col>
                                                    <i className="fa fa-facebook-official" style={{'fontSize':'32px','color':'#007bff'}} onClick={()=>this.clearPlaceholder("facebook")}></i>
                                                    <input type="input" className="Profile EditBar" id="facebook" placeholder={data.facebook} style={{'marginLeft':'1vw','width':'75%'}}></input>
                                                    <i className="fa fa-close Profile iconBtn"  onClick={()=>this.this.clearPlaceholder("facebook")}></i>
                                                </Col>
                                            </Col>
                                        </Row>

                                        <Button style={{'float':'right','marginTop':'2vh','width':'10%'}}
                                            onClick={()=>this.updateProfile()}
                                        >送出</Button>

                                    </div>

                                :   <div>
                                        <Row>
                                            <Col>姓名：{data.name}</Col>
                                            <Col>生日：{data.birthday}</Col>
                                        </Row>
                                        <Row>
                                            <Col>信箱：{data.email}</Col>
                                            <Col>電話：{data.phone}</Col>
                                        </Row>
                                        <Row>
                                            <Col>個人頁面：
                                            {
                                                data.LinkedIn
                                                ? <span style={{'marginRight':'1%'}}><a href={data.LinkedIn}><i className="fa fa-linkedin-square" style={{'fontSize':'32px'}}></i></a></span>
                                                : <span style={{'marginRight':'1%'}}><i className="fa fa-linkedin-square" style={{'fontSize':'32px','color':'grey'}}></i></span>
                                            }
                                            {
                                                data.github
                                                ? <span style={{'marginRight':'1%'}}><a href={data.github}><i class="fa fa-github" style={{'fontSize':'32px'}}></i></a></span>
                                                : <span style={{'marginRight':'1%'}}><i className="fa fa-github" style={{'fontSize':'32px','color':'grey'}}></i></span>
                                            }
                                            {
                                                data.facebook
                                                ? <span style={{'marginRight':'1%'}}><a href={data.facebook}><i class="fa fa-facebook-official" style={{'fontSize':'32px'}}></i></a></span>
                                                : <span style={{'marginRight':'1%'}}><i className="fa fa-facebook-official" style={{'fontSize':'32px','color':'grey'}}></i></span>
                                            }
                                            </Col>
                                            <Col>公開個人頁面：
                                                <span><Switch color="primary"  onChange={this.handleChange} checked={this.state.isPublic} inputProps={{'aria-label':'primary checkbox'}}/></span>

                                            </Col>
                                        </Row>
                                    </div>
                            }


                        </div>
                    </Card>
                    <Card className='border-0'>
                        <div className='Profile userInfo'>
                            <div>
                                <h1>
                                    <span><i className="fa fa-mortar-board" style={{'fontSize':'32px'}}></i></span>
                                    <span className='Profile Card_Title'>學習歷程</span>
                                    <span>
                                        <i className="fa fa-toggle-right Profile icon" onClick={() => this.toggleCarousel('next')}></i>
                                        <i className="fa fa-toggle-left Profile icon" onClick={() => this.toggleCarousel('prev')}></i>
                                    </span>
                                </h1>
                            </div>
                            <div className='Profile divider'></div>
                            <div>
                            <Carousel interval={null} indicators={false} style={{'minHeight':'30vh'}} controls={false} activeIndex={this.state.index} direction={this.state.direction}>{this.getHistory()}</Carousel>

                            </div>
                        </div>
                    </Card>

                    <Card className='border-0'>
                        <div className='Profile userInfo'>
                            <div>
                                <h1>
                                    <span><i className="fa fa-folder" style={{'fontSize':'32px'}}></i></span>
                                    <span className='Profile Card_Title'>學習成果</span>
                                    <span>
                                        <i className="fa fa-plus Profile icon" onClick={()=>this.handleShow("artwork")}></i>
                                    </span>
                                </h1>
                            </div>
                            <div className='Profile divider'></div>
                            <div style={{'minHeight':'20vh'}}>{artwork}</div>
                        </div>
                    </Card>

                    <Card className='border-0'>
                        <div className='Profile userInfo'>
                            <div>
                                <h1>
                                    <span><i className="fa fa-flask" style={{'fontSize':'32px'}}></i></span>
                                    <span className='Profile Card_Title'>活動事蹟</span>
                                    <span>
                                        <i className="fa fa-plus Profile icon" onClick={()=>this.handleShow("activities")}></i>
                                    </span>
                                </h1>
                            </div>
                            <div className='Profile divider'></div>
                            <div style={{'minHeight':'20vh'}}>{activities}</div>
                        </div>
                    </Card>
                    <Modal show={this.state.isShowArtwork} onHide={()=>this.handleClose("artwork",{})} centered backdrop="static" dialogClassName="Profile Mymodal">
                        <Modal.Header closeButton>
                            <h2 className="Profile MymodalTitle">新增學習成果</h2>
                        </Modal.Header>
                        <Modal.Body>

                            <Row>
                                <Col>
                                <span className="Profile MymodalFont">成果名稱：</span>
                                <span><input className="Profile Mymodal msg" type="text" id='name' name="name"/></span>
                                </Col>
                            </Row>


                            <Row>
                                <Col>
                                <span className="Profile MymodalFont">成果連結：</span>
                                <span><input className="Profile Mymodal msg" type="text" id='link' name="link" placeholder='(若無則免)' /></span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <span className="Profile MymodalFont">成果說明：</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col><textarea rows="10" cols="70" id='description' className="Profile Mymodal msgarea" type="text" name="description"/></Col>
                            </Row>


                            <Row>
                                <Col>

                                </Col>
                            </Row>


                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" style={{'width':'20%', 'margin':'0px'}} onClick={
                                ()=>this.handleClose("artwork",
                                {name:document.getElementById('name').value,
                                description:document.getElementById('description').value,
                                link:document.getElementById('link').value
                                })}>送出
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.isShowActivities} onHide={()=>this.handleClose("activities",{})} centered backdrop="static" dialogClassName="Profile Mymodal">
                        <Modal.Header closeButton>
                                <h2 className="Profile MymodalTitle">新增活動事蹟</h2>
                            </Modal.Header>
                            <Modal.Body>

                                <Row>
                                    <Col>
                                    <span className="Profile MymodalFont">活動時間：</span>
                                    <span><input className="Profile Mymodal msg" id='time' type="date" name="time"/></span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <span className="Profile MymodalFont">事蹟說明：</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col><textarea rows="10" cols="70" id='description' className="Profile Mymodal msgarea" type="text" name="description"/></Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" style={{'width':'20%', 'margin':'0px'}} onClick={
                                    ()=>this.handleClose("activities",
                                    {time:document.getElementById('time').value,
                                    description:document.getElementById('description').value
                                    })}>
                                            送出
                                </Button>
                            </Modal.Footer>
                    </Modal>
                </div>
            )
        }
        else{
            return(
                <div></div>
            )
        }

    }
}


export default Profile;
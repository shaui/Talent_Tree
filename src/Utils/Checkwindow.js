import React, {Component} from 'react';
import { Button, Modal } from 'react-bootstrap';
import './Checkwindow.css'
class Checkwindow extends Component{
  constructor(props){
    super(props)
    this.state = {
      
    }
  }



  render(){
    return(
      <div>

        <Modal show={this.props.isShow} onHide={this.props.handleHide} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <p className='Checkwindow title'>確定學習技能？</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='Checkwindow body'>請確認是否符合技能學習條件，若不符合條件請點選「取消學習」</p>
          </Modal.Body>
          <Modal.Footer>
            <button className='Checkwindow cancel_button' onClick={this.props.handleCancel}>
              取消學習
            </button>
            <button className='Checkwindow confirm_button' onClick={this.props.handleConfirm}>
              習得技能
            </button>
          </Modal.Footer>

        </Modal>
      </div>


    )
  }
}
export default Checkwindow;

// function Example() {
//     const [show, setShow] = useState(false);

//     //const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     const handleClose = () => setShow(false);

//     const ReturnAnswer_True = function(){
//       setShow(false);
//       return true;
//     }
//     const ReturnAnswer_False = function(){
//       setShow(false);
//       return false;
//     }
//     return (
//       <>
//         <Button variant="primary" onClick={handleShow}>
//           Launch demo modal
//         </Button>

//         <Modal show={show} onHide={handleClose} animation={false} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>確定學習技能？</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>請確認是否符合技能學習條件，若不符合條件請點選「取消學習」</Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={ReturnAnswer_False}>
//               取消學習
//             </Button>
//             <Button variant="primary" onClick={ReturnAnswer_True}>
//               習得技能
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </>
//     );
//   }

//   render(<Example />);
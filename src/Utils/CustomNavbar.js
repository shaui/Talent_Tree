import React, { useState, useContext } from 'react';

import logo from '../logo.svg';
import {
  Navbar,
  Nav,
  NavDropdown,
  Button } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './CustomNavbar.css'

import SignInDialog from './SignInDialog.js'

import UserContext from '../Contexts/UserContext.js'
import firebase from 'firebase';



const CustomNavbar = () => {
  const context = useContext(UserContext)
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
  }

  return (

    <Navbar bg="light" expand="lg" style={{'width':'100vw', 'position':'fixed','top':'0px' , 'zIndex':'99'}} className={"navbar"+ (context.user ? " ENT" : "") } id="navbar">
      <Navbar.Brand href="/">
        <img src={logo} alt="react-router-breadcrumb" width="50" height="50" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" >
        <Nav className="mr-auto">
          <Nav.Link href="/">首頁</Nav.Link>
          <Nav.Link href="/hunt">企業專區</Nav.Link>
          <NavDropdown title="論壇" id="basic-nav-dropdown">
            <NavDropdown.Item href="/forum">論壇總覽</NavDropdown.Item>
            <NavDropdown.Item href="/forum/post">發布文章</NavDropdown.Item>
            <NavDropdown.Item href="/forum/posts">我的帖子</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav className="ml-auto">
        <CSSTransition in={ (typeof context.user === "boolean" || context.user) } timeout={500} classNames="userBtn" unmountOnExit appear>
        {
          context.user ? 
            <Button variant="primary" onClick={() =>{
              firebase.auth().signOut()
              window.location.replace("/")
            }}>會員登出</Button>
          :
            <Button variant="primary" onClick={handleShow}>會員登入</Button>
        }
        </CSSTransition>
        </Nav>
      </Navbar.Collapse>
      <SignInDialog isShow={show} handleClose={handleClose}/>
    </Navbar>

  );
};

export default CustomNavbar;
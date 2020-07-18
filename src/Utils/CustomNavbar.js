import React from 'react';
import logo from '../logo.svg';
import {
  Navbar,
  Nav,
  NavDropdown } from 'react-bootstrap';

const CustomNavbar = () => {

  return (

    <Navbar bg="light" expand="lg" style={{'width':'100vw', 'height':'10vh', 'position':'fixed','top':'0px' , 'zIndex':'99'}}>
      <Navbar.Brand href="#home">
        <img src={logo} alt="react-router-breadcrumb" width="50" height="50" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" >
        <Nav className="mr-auto">
          <Nav.Link href="/">首頁</Nav.Link>
          <Nav.Link href="/">技能樹</Nav.Link>
          <NavDropdown title="論壇" id="basic-nav-dropdown">
            <NavDropdown.Item href="/forum">論壇總覽</NavDropdown.Item>
            <NavDropdown.Item href="/forum/post">發布文章</NavDropdown.Item>
            <NavDropdown.Item href="/forum/posts">我的帖子</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link href="/signIn">會員登入</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  );
};

export default CustomNavbar;
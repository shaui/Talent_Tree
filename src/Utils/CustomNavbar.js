import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import { 
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

const CustomNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="md" style={{'width':'100vw', 'height':'10vh', 'position':'fixed', 'z-index':'99'}}>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink href="/">
              <img src={logo} alt="react-router-breadcrumb" width="30" height="30" />
            </NavLink>

          </NavItem>
          <NavItem>
            <NavLink href="/">首頁</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">技能樹</NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              論壇
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <NavLink href="/forum">論壇總覽</NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink href="/forum/post">發布文章</NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink href="/forum/posts">我的帖子</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          
        </Nav>
        <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink href="/login">會員登入</NavLink>
            </NavItem>
        </Nav>
        
      </Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
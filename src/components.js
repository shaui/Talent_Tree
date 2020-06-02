import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import { 
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination, 
  PaginationItem, 
  PaginationLink } from 'reactstrap';
import './bootstrap.min.css'

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="md" style={{'width':'100vw'}}>
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
                <NavLink href="/forum/index">論壇總覽</NavLink>
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

const ForumPagination = () => {
  return (
    <Pagination size="sm" aria-label="Page navigation">
      <PaginationItem>
        <PaginationLink first href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink previous href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">
          1
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">
          3
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink next href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink last href="#" />
      </PaginationItem>
    </Pagination>
  );
};

export { CustomNavbar, ForumPagination };
import React from 'react';
import { Pagination } from 'react-bootstrap';

class CustomPagination extends React.Component {

  render() {
    let activePage = this.props.activePage
    activePage = activePage ? activePage : 1
    const posts = this.props.posts
    const max = posts.length ? ( posts.length % 30 ? (posts.length / 30) + 1 : posts.length / 30 ) : 1
    let items = [] ;
    for (let number = 1; number <= max; number++) {
    items.push(
      <Pagination.Item key={ number } active={ number === activePage }>
        { number }
      </Pagination.Item>,
    );
}
    return (
      <Pagination>
        { activePage === 1 ? <Pagination.First disabled /> : <Pagination.First /> }
        { activePage === 1 ? <Pagination.Prev disabled /> : <Pagination.Prev /> }
        { items }
        { activePage === max ? <Pagination.Next disabled /> : <Pagination.Next /> }
        { activePage === max ? <Pagination.Last disabled /> : <Pagination.Last /> }
      </Pagination>
    )
  }
}

export default CustomPagination;
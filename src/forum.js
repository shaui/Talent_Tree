import React from 'react';
import { Table, Button } from 'reactstrap';
import './forum.css';


class PostsTable extends React.Component {
	render() {
		return (
			<Table hover>
		      <thead>
		        <tr>
		          <th>資源分類</th>
		          <th>資源名稱</th>
		          <th>發布者</th>
		          <th>回復/觀看</th>
		          <th>好評/負評</th>
		          <th>發布時間</th>
		        </tr>
		      </thead>
		      <tbody>
		        <tr>
		          <th scope="row">平台課程</th>
		          <td>
		          	<a href="#">Introduction to Python: Fundamentals - Microsoft</a>
		          </td>
		          <td>Mark</td>
		          <td>124/1294</td>
		          <td>77/0</td>
		          <td>2020-5-28 09:17</td>
		        </tr>
		        <tr>
		          <th scope="row">平台課程</th>
		          <td>
		          	<a href="#">Python Basics for Data Science - IBM</a>
		          </td>
		          <td>Jacob</td>
		          <td>594/8495</td>
		          <td>519/2</td>
		          <td>2020-5-19 22:01</td>
		        </tr>
		        <tr>
		          <th scope="row">筆記分享</th>
		          <td>
		          	<a href="#">Python 入門＆基本教學介紹！</a>
		          </td>
		          <td>Larry</td>
		          <td>21/300</td>
		          <td>5/0</td>
		          <td>2020-5-31 00:57</td>
		        </tr>
		      </tbody>
		    </Table>
		);
	}
}

class PostingPage extends React.Component {
  render() {
    return (
    	<div class="content">
    		<div class="container banner-container">
    			<div class="row"></div>
    		</div>


    		<div class="container">
    			<div class="row justify-content-between">
    				<div class="col-4">
    					<Button id="post-btn" color="primary">
    						發布文章
    					</Button>
    				</div>
    				<div class="col-6">
    					{/* <Pagination /> */}
    				</div>
    			</div>
    		</div>
    		<div class="container">
    			<div class="row">
    				<div class="col">
    					<PostsTable />
    				</div>
    			</div>
    		</div>
    		<div class="container">
    			<div class="row">
    				<div class="col-6 align-self-end">
    					{/* <Pagination /> */}
    				</div>
    			</div>
    		</div>
    	</div>
    );
  }
}

export default PostingPage;
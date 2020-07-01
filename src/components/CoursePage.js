import React, {Component} from 'react';
import './CoursePage.css'
import $ from 'jquery'

function Course(props) {
  return (
    <div className="container">
		<div>
			<h1>Python</h1>
		</div>
      <div className="row course-icon">
      	<div className="col">
      		<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRw728JESaDNMSj_h3zrUUD49Xwgf0WNGAQcZKn7Kk9aZm2fGMK&usqp=CAU" className="img-thumbnail float-left" alt="Cinque Terre" style={{'width':'20vw','marginBottom':'10px'}}/>
      		<div className="row course-introduction">
		<div className="col">
		    <p className="text-justify">Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Praeterea iter est quasdam res quas ex communi. At nos hinc posthac, sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem certam indicere. Cras mattis iudicium purus sit amet fermentum.</p>
		</div>
      </div>

      <div className="row course-link">
		<div className="col">
			<a href="#" class="btn btn-info" role="button" aria-pressed="true">Course 1</a>
			<a href="#" class="btn btn-info" role="button" aria-pressed="true">Course 2</a>
			<a href="#" class="btn btn-info" role="button" aria-pressed="true">Course 3</a>
			<a href="#" class="btn btn-info" role="button" aria-pressed="true">Course 4</a>
		</div>
      </div>
      	</div>

      </div>
      
    </div>
  );
}

function Comment(props) {
  return (
    <div className="container">
		<div className="card">
			<div className="card-body">

				<div className="circular-avatar float-left">
					<img src="http://petonea.com/file//n373/t.jpg" className="card-avatar"/>
				</div>
				<div className="content">
					<h5 class="user-name">Jonathan</h5>
					<p className="card-text">This course aims to teach everyone the basics of programming computers using Python. We cover the basics of how one constructs a program from a series of simple instructions in Python. The course has no pre-requisites and avoids all but the simplest mathematics. Anyone with moderate computer experience should be able to master the materials in this course. </p>
				</div>
				<div className="actions">
					<a href="#">
						<span class="glyphicon glyphicon-heart" aria-hidden="true"></span>
					</a>
				</div>
				
			</div>
		</div>
    </div>
  );
}

class CoursePage extends Component{
	constructor(props){
		super(props)
		this.state = {

		}
	}

	render() {
		return (
			<div className='container' style={{'paddingTop':'10vh'}}>
				<div className='row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<Course />
					</div>
				</div>
				<div className='row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<Comment />
						<Comment />
						<Comment />
						<Comment />
					</div>
				</div>
			</div>
		);
	}
}

export default CoursePage;
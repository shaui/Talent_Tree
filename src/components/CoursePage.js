import React, {Component} from 'react';
import './CoursePage.css'
import $ from 'jquery'

function Course(props) {
  return (
    <div className="container">
		<div>
			<h1>Python</h1>
		</div>
      <div className="CoursePage row course-icon">
      	<div className="col">
      		<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRw728JESaDNMSj_h3zrUUD49Xwgf0WNGAQcZKn7Kk9aZm2fGMK&usqp=CAU" className="img-thumbnail float-left" alt="Cinque Terre" style={{'width':'20vw','marginBottom':'10px'}}/>
      		<div className="CoursePage row course-introduction">
		<div className="col">
		    <p className="CoursePage text-justify">Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Praeterea iter est quasdam res quas ex communi. At nos hinc posthac, sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem certam indicere. Cras mattis iudicium purus sit amet fermentum.</p>
		</div>
      </div>

      <div className="CoursePage row course-link">
		<div className="col">
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 1</a>
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 2</a>
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 3</a>
			<a href="#" class="CoursePage btn btn-info" role="button" aria-pressed="true">Course 4</a>
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
		<div className="CoursePage card">
			<div className="CoursePage card-body">

				<div className="CoursePage circular-avatar float-left">
					<img src="http://petonea.com/file//n373/t.jpg" className="CoursePage card-avatar"/>
				</div>
				<div className="CoursePage content">
					<h5 class="CoursePage user-name">2020/9/9</h5>
					<p className="CoursePage card-text">
						關注了Tensorflow For CNN Cifar-10
					</p>
				</div>
				<div className="CoursePage actions">
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
				<div className='CoursePage row row-style'>
					<div className='col' style={{'backgroundColor':'white'}}>
						<Course />
					</div>
				</div>
				<div className='CoursePage row row-style'>
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
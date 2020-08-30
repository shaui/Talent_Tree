import React from 'react';
import { Alert } from 'react-bootstrap';
import './TransitionAlert.css';
import { CSSTransition } from 'react-transition-group';

function TransitionAlert(props) {

	return (
		<CSSTransition in={props.show} timeout={500} classNames="alert" unmountOnExit appear>
      <Alert variant="danger" className={props.className}>
        <Alert.Heading>{props.title}</Alert.Heading>
        <p>
          {props.content}
        </p>
      </Alert>
    </CSSTransition>
	)
}

export default TransitionAlert;
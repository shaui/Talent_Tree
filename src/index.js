import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TechDialog from './components/TechDialog'
import MyTree from './components/MyTree'
import treeData from './Database/talent tree.json'
import {BrowserRouter, Switch} from 'react-router-dom'

import * as serviceWorker from './serviceWorker';

var data = treeData

ReactDOM.render(
  <React.StrictMode>
  	<BrowserRouter>
  		<Switch>
	  		<App/>
  		</Switch>
  	</BrowserRouter>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

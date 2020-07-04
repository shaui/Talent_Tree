import React, { Component } from 'react';
import { CustomNavbar } from './widgets';
import { Route } from 'react-router-dom';
import PostingPage from './components/Forum';
import MyTree from './components/MyTree';
import treeData from './Database/talent tree.json';
import * as firebase from "firebase/app"; 
import routes from './routes';


var firebaseConfig = {
      apiKey: "AIzaSyAmqePMKEW7AYPG_H3oEWis5fiG3L7Di18",
      authDomain: "fbis-9c326.firebaseapp.com",
      databaseURL: "https://fbis-9c326.firebaseio.com",
      projectId: "fbis-9c326",
      storageBucket: "fbis-9c326.appspot.com",
      messagingSenderId: "1094841330312",
      appId: "1:1094841330312:web:ddc90dc5ad66f3c9facd3d",
      measurementId: "G-1B1VZ30148"
};

firebase.initializeApp(firebaseConfig);

var data = treeData

class App extends Component {
  render() {
    return (
    	<div className="">
    		<div className="main">
	    		<CustomNavbar/>

          {routes.map((route, i) => {
            const { path, exact, routes } = route;
            return (
              <Route
                key={i}
                path={path}
                exact={exact}
                render={(routeProps) => (
                  <route.component routes={routes} {...routeProps} />
                )}
              />
            );
          })}
	    	</div>
    	</div>
    )
  }
}

export default App;
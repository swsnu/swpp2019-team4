import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import Main from './containers/Main/Main';
import Account from './containers/Account/Account';
import Verify from './containers/Verify/Verify';
import TimetableManagement from './containers/TimetableManagement/TimetableManagement';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css';
import './App.css';

function App(props) {
  const info = props;
  return (
    <ConnectedRouter history={info.history}>
      <div className="App">
        <Switch>
          <Route path="/verify/:uid/:token" exact component={Verify} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/main" exact component={Main} />
          <Route path="/manage" exact component={TimetableManagement} />
          <Route path="/account" exact component={Account} />
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;

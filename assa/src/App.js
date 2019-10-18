import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import Login from './containers/login/Login';
import Main from './containers/main/Main'
import './App.css';
function App(props) {
    return (
        <ConnectedRouter history={props.history}>
            <div className="App">
                <Switch>
                    <Route path='/login' exact component={Login}/>
                    <Route path='/main' exact component={Main}/>
                    <Redirect from='/' to='/login'/>
                </Switch>
            </div>
        </ConnectedRouter>
    );
}

export default App;

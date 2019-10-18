import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import Login from './containers/Login/Login';
import Main from './containers/Main/Main'
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

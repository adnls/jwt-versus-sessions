import React, {Component} from 'react';
import {
    Route, Redirect, Switch, BrowserRouter as Router
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute.js'
import LoginForm from './LoginForm';
import Home from './Home.js';

export default
class App extends Component {
    /*constructor(props){
    super(props);
    }*/

    render(){
        return (
            <Router>
                <Switch>
                    <PrivateRoute path='/home' isLoggedIn={true} 
                                                render={()=><Home/>}/>
                    <Route path='/login' render={(props)=><LoginForm {...props}/>}/>
                    <Redirect exact from='/' to='/home'/>
                    <Redirect to='/home'/>
                </Switch>
            </Router>
        );
    }
}


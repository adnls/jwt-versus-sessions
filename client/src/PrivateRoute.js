import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({ render: Component, isLoggedIn, ...rest }) => {
    return (
    <Route
        {...rest}
        render={props =>
        isLoggedIn? (
            <Component {...props}/>
        ) : (
            <Redirect
            from={props.location}
            to='/login'
            />
        )
    }
    />
)};

export default PrivateRoute;
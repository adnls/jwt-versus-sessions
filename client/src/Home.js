import React, { Component } from 'react';
import AuthService from './AuthService.js';
import { Redirect } from 'react-router-dom';
//import axios from 'axios';
import socketIOClient from 'socket.io-client';

export default
class Home extends Component {
    constructor(props){
        super(props);
        this.authService = new AuthService();
        this.state = {
            socketOpen:false
        }
    }

    componentDidMount(){
        
        //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        this.socket = socketIOClient({
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'x-xsrf-token': this.authService.getJwtKey()
                    }
                }
            },
            cookies:false
        });

        this.socket.on('auth', res => {
            if (res === 'ok') {
                this.setState({socketOpen:true});
            } 
            else 
                this.setState({socketOpen:-1});
        });         
    }

    render(){
        return (
            this.state.socketOpen === -1?
                <Redirect to='/login'/>
                :
                this.state.socketOpen?
                    <h1>Socket open</h1>
                    :
                    <h1>Loading...</h1>
        );
    }
}
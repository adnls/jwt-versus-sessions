import React, {Component} from 'react';
import AuthService from './AuthService.js';
import {Redirect} from 'react-router-dom';
//todo fonction pour les setstates
//compartmenter render en plusieurs fonctions

export default
class LoginForm extends Component{
    
    constructor(props){
        
        super(props);
        
        this.authService = new AuthService();
        
        this.state={
            shouldRedirect:false
        }

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
    
    }

    handleSubmit(e){

        e.preventDefault();
        this.authService.login(()=>this.setState({shouldRedirect:true}));
        //don't refresh automatically
    }

    
    handleChange(e){
        const val = e.target.value;
        const name = e.target.name;
        this.setState({[name]:val});
    }

    
    render(){
        
        const {from} = this.props.location.state || {from:{pathname:'/'}}
        console.log(from);

        return(
            this.state.shouldRedirect?
            <Redirect to={ from }/>
            :
            <form onSubmit={this.handleSubmit}>
                
                <label>
                    Email
                </label>
                
                <br/>
                
                <input type='text'
                        name='email'
                        onChange={this.handleChange}
                        />
                
                <br/>

                <label>
                Password
                </label>
                
                <br/>

                <input type="password"
                        name="password"
                        onChange={this.handleChange}
                        />
                
                <br/>

                <input type="submit" value="Log in"/>
            
            </form>
        );
    }
}

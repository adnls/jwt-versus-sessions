import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client';
import authService from './Utils.js';

// Making the App component
class App extends Component {
  constructor(props) {
    super(props);

    this.color='lightgray';
    this.palette=['lightseagreen', 'lightcoral', 'lightcyan', 
    'lightblue', 'lightgreen', 'lightyellow', 'lightsalmon',
    'lightpink', 'lightskyblue', 'lightsteelblue'];

    this.state={
      msgBox:'',
      logBox:'',
      messages : []
    }

    this.handleClick=this.handleClick.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }

  componentDidMount(){

    this.socket=socketIOClient();

    this.socket.on('message', msg => {

      this.setState(prevState => {
          var newMessages = prevState.messages;
          newMessages.push(msg);
          return {messages:newMessages}
      })
    })
  }

  handleClick(e){
      this.color = e.target.id;
  }

  handleSubmit(e){

    const id = e.target.id;

    switch(id){
      case 'logForm':
        console.log(this.state.messages);
        sessionStorage.setItem('utilisateur', this.state.logBox);
        this.setState({logBox:''});
        break;

      case 'msgForm':
        const txt = this.state.msgBox;
        const color = this.color;
        const user = authService.getUserName();
        const msg = {txt:txt, color:color, user:user};
        this.socket.emit('message', msg);
        
        this.setState(prevState=>
          {
            /*var newMessages = prevState.messages;
            newMessages.push(msg);
            return{msgBox:'', messages:newMessages}*/
            return{msgBox:''}
          });
        break;

      default:
        break;
    }
    
    
    e.preventDefault();
    
  }

  handleChange(e){
      const val = e.target.value;
      const id = e.target.name;
      this.setState({[id]:val});
  }
  // render method that renders in code if the state is updated
  render() {

    

    return (
      authService.isLogged() ?
      //change click palette msgBox submit messages
      <LoginView handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                handleClick={this.handleClick}
                messages={this.state.messages}
                palette={this.palette}
                msgBox={this.state.msgBox}/>
      :
      <ChatView handleSubmit={this.handleSubmit} 
      handleChange={this.handleChange} 
      logBox={this.state.logBox}/>
    )
  }
}

const Messages = (props) =>  props.messages.map((msg, i) =>{
  return(
  <div key={i}>
    <div style={{fontSize:'10px'}}>
    {msg.user !== authService.getUserName() ? msg.user + ' a écrit :' : 'Vous avez écrit :'}
    </div>
    <div style={{backgroundColor:msg.color, height:'30', padding:'8px'}}>
      {msg.txt}
    </div>
  </div>);
});

const Colors = (props) => props.palette.map((color, i) =>{
      return(
        <button id={color} key={i} onClick={props.handleClick}>{color}</button>);
    });


const LoginView = (props) =>  <div>
                <h1>Chat</h1>
                <h2>{authService.getUserName()}</h2>
                <p>Vous pouvez changer la couleur de votre prochain message en appuyant sur le bouton :</p>
                <Colors handleClick={props.handleClick} palette={props.palette}/>
                <Messages messages={props.messages}/>
                <form onSubmit={props.handleSubmit} id='msgForm'>
                  <input type='text' name='msgBox' onChange={props.handleChange} value={props.msgBox}/>
                  <input type='submit' value='send'/>
                </form>
                </div>;

const ChatView = (props) => <div>
      <h1>Connectez-vous au chat!</h1>
      <form onSubmit={props.handleSubmit} id='logForm'>
        <label>
          {'Nom : '} 
        <input type='text' name='logBox' onChange={props.handleChange} value={props.logBox}/>
        </label>
        <input type='submit' value='Log in'/>
      </form>
      </div>;

export default App


import React from "react";
import { BrowserRouter, Route} from "react-router-dom";

import axios from "axios";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

const LoadingScreen = () => {
  return ('')
}

class TodoApp extends React.Component {
  constructor(){
    super();
    this.fetchLoginData = this.fetchLoginData.bind(this);
    this.authDisplay = this.authDisplay.bind(this);
    this.state = {
      loginStatus: 'pending'
    }

  }

  componentDidMount(){
    console.log('Login status -'+this.state.loginStatus);
    this.fetchLoginData();

  }

  fetchLoginData(){
    axios.get('/api/current_user').then((res) => {
      console.log(res);
      if(res.data.googleId){
        console.log('res existing');
        console.log(res);
        this.setState(() => {
          return ({loginStatus:'logged-in'});
        });
      }else{
        console.log('res not existing');
        console.log(res);
        this.setState(() => {
          return ({loginStatus:'logged-out'});
        });
      }
    })

  }

  authDisplay(){
    console.log(this.state.loginStatus);
    if(this.state.loginStatus === 'logged-in'){
      return (
        <div>
        <Dashboard loginStatus={true}/>
        </div>
      )
    }else if(this.state.loginStatus === 'logged-out'){
      return (
        <div>
        <LandingPage loginStatus={false}/>
        </div>
      )
        }else if(this.state.loginStatus === 'pending'){
      return (
        <LoadingScreen/>
      )
    }
  }

  render() {
    return (
      <div className="react-wrapper">
        {this.authDisplay()}
      </div>
    );
  }
}

export default TodoApp;

/*
class TodoApp extends React.Component {
  render() {
    return (
      <div className="react-wrapper">
        <Header />
        <p>Paragraph</p>
        <NoteSection />
        <NoteInput />
      </div>
    );
  }
}
*/

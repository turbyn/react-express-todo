import React from "react";

const Login = () => {
  return (
   <a href="/auth/google">Login!</a>
  )
}

const Logout = () => {
  return (
    <a href="/api/logout">Logout!</a>
  )
}

class Header extends React.Component {
  constructor(props){
    super(props);
    this.displayLoginStatus = this.displayLoginStatus.bind(this);
  }

  displayLoginStatus(){
    if(this.props.loginStatus){
      return (
        <li><a href="/api/logout">Logout</a></li>
      )
    }else{
      return (<li><a href="/auth/google">Login</a></li>)
    }
  }

  render() {
    return (
      <nav>
        <div>
          <a href="#" className="brand-logo">Todo app</a>
           <ul id="nav-mobile" className="right hide-on-med-and-down">
             {this.displayLoginStatus()}
           </ul>
        </div>
      </nav>
    );
  }
}

export default Header;


/*
<h1>Header {this.props.loginStatus ? <Logout/> : <Login/>}</h1>
*/

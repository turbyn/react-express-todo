import React from "react";

import axios from "axios";
class UserCreation extends React.Component {
  constructor(props){
    super(props);
    this.submitNameForm = this.submitNameForm.bind(this);

  }

  submitNameForm(e){
    e.preventDefault();
    const formUsername = e.target.username.value;
    console.log(formUsername);
    axios({
      method:'post',
      url:'/updateUser',
      data: {userName : formUsername}
      }).then((response) => {
      this.props.changeUserName(formUsername);
      this.props.toggleModal();
    })
    //axios request here
  }

  render(){
    return (
      <div>
        <h4>Hello, it looks like it is your first visit.</h4>
        <p>Please enter your name and select your avatar</p>
        <form onSubmit={this.submitNameForm}>

        <label>Name:</label><input type="text" name="username"/>
        <button type="submit">Submit!</button>

        </form>
      </div>
    )
  }
}

export default UserCreation;

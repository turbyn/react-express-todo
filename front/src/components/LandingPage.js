import React from "react";
import Header from "./Header";

class LandingPage extends React.Component {
  constructor(){
    super();
  }

  render() {
    return (
      <div className="react-wrapper">
        <Header loginStatus={this.props.loginStatus}/>
        <div className="icon-block">
          <div className="row">
            <div className="col s12">
              <p>Landing page</p>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default LandingPage;

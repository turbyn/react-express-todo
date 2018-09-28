import React from "react";
const moment = require('moment');
const $ = require('jquery');
import { Collapsible, CollapsibleItem } from 'react-materialize'

class Todo extends React.Component {
  constructor(props){
    super(props);
    this.renderNote = this.renderNote.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  handleRemove(){
    console.log(this.props)
    this.props.removeTodo(this.props.id);
  }

  handleComplete(){
    console.log('Finishing '+this.props.id)
    this.props.completeTodo(this.props.id);
  }

  renderButton(){
    if(this.props.category !== 'done'){
      return ((<a className="btn-floating btn-medium" onClick={this.handleComplete}><i class="material-icons">done</i></a>))
    }
  }

  renderNote(){
      return (
        <div className="individual-todo-max">
            <Collapsible>
              <CollapsibleItem header={this.props.title} icon='filter_drama'>
              <div className="row">
                <div className="col s9">
                <span class="card-title">Card Title</span>
                <p>{this.props.content}</p>
                <blockquote><b>{moment(this.props.deadline).format("dd, MMMM Do YYYY, h:mm")}</b></blockquote>

                </div>
                <div className="col s3">
                <a className="btn-floating btn-medium" onClick={this.handleRemove}><i class="material-icons">delete_forever</i></a>
                {this.renderButton()}
                </div>
                </div>
              </CollapsibleItem>
            </Collapsible>
        </div>
      )
    }




  render(){
    return(
    this.renderNote()
    )
  }
};

export default Todo;
            // <button onClick={this.handleRemove}>Remove</button>

/*
<div className="individual-todo">
    <h4>Title: {this.props.title}</h4>
    <p>Content: {this.props.content}</p>
    <p>Timestamp: {this.props.timestamp}</p>
    <p>Author: {this.props.author}</p>
    <p>ID: {this.props.id}</p>
    <p>Deadline: {moment(this.props.deadline).format("dd, MMMM Do YYYY, h:mm")}</p>
</div>

    */

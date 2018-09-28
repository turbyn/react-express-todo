import React from "react";
import Todo from "./Todo.js";

const moment = require('moment')

class Summary extends React.Component {
  constructor(props){
    super(props);

    this.renderNotes = this.renderNotes.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount(){
    console.log('Notes incoming ')
    this.renderNotes()
  }

  handleRemove(){
    this.props.removeTodo();
    this.forceUpdate();
  }

  renderNotes(notesArray){
    console.log(notesArray);
    if(notesArray  && notesArray.length > 0){
      return notesArray.map((itemObject) => {
        return (
          <div>
          <Todo key={itemObject.id}
                author={itemObject.author}
                content={itemObject.content}
                timestamp={itemObject.timestamp}
                title={itemObject.title}
                id={itemObject._id}
                deadline={itemObject.deadline}
                category={itemObject.category}
                removeTodo={this.handleRemove}
           /></div>
       )})
    }

   }

   getNumberOfNotes(notesArray){
     if(notesArray.length > 0){
       return notesArray.length
     }
   }

  render() {
    return (
      <div>
        <blockquote><h4 className="left-align">Todos past<span className="badge">{this.getNumberOfNotes(this.props.notesPast)}</span></h4></blockquote>
        {this.renderNotes(this.props.notesPast)}
        <blockquote><h4 className="left-align">Todos today<span className="badge">{this.getNumberOfNotes(this.props.notesToday)}</span></h4></blockquote>
        {this.renderNotes(this.props.notesToday)}
        <blockquote><h4 className="left-align">Todos tomorrow<span className="badge">{this.getNumberOfNotes(this.props.notesTomorrow)}</span></h4></blockquote>
        {this.renderNotes(this.props.notesTomorrow)}
        <blockquote><h4 className="left-align">Todos this week<span className="badge">{this.getNumberOfNotes(this.props.notesWeek)}</span></h4></blockquote>
        {this.renderNotes(this.props.notesWeek)}
        <blockquote><h4 className="left-align">Todos this month<span className="badge">{this.getNumberOfNotes(this.props.notesMonth)}</span></h4></blockquote>
        {this.renderNotes(this.props.notesMonth)}
      </div>
    );
  }
}

export default Summary;

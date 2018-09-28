import React from "react";
import Datetime from 'react-datetime';
import moment from 'moment';
class FormInput extends React.Component {
  constructor(props){
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleCategoryDelete = this.handleCategoryDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedMoment : new moment()
    }
  }

  componentDidMount(){
    console.log('Mounted form input');

  }

  handleChange(moment){
    this.setState(() => {
      return ({selectedMoment : moment})
    })
    console.log(this.state.selectedMoment)
  }

  onFormSubmit(e){
    e.preventDefault();
    console.log('Helloo')
    console.log('Creating note with:');
    console.log({
      author: this.props.userAccountName,
      title: e.target.title.value,
      content: e.target.content.value,
      category: this.props.currentCategory,
      deadline: this.state.selectedMoment
    });
    this.props.postNote({
      author: this.props.userAccountName,
      title: e.target.title.value,
      content: e.target.content.value,
      category: this.props.currentCategory,
      deadline: this.state.selectedMoment
    })
  }

  handleCategoryDelete(){
    this.props.deleteCategory(this.props.currentCategory);
    this.props.returnToSummary();
  }

  render() {
    return (
      <div className="form-input">
        <form onSubmit={this.onFormSubmit}>
          <div className="row">
            <div className="col s8">
              <label>Deadline</label><Datetime id="datepicker" name="deadline" onChange={this.handleChange}/>
              <label>Title</label><input type="text" name="title" autocomplete="off"/><br/>
              <label>Content</label><input type="text" name="content" autocomplete="off"/><br/>
              <br/>
              <button className="btn waves-effect waves-light" type="submit">Submit
                <i className="material-icons right">send</i>
              </button>
            </div>
            <div className="col s4">
              <button className="btn right-align remove-button" onClick={this.handleCategoryDelete}>
                Remove category <i className="material-icons right">remove</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormInput;

//removed <label>Author</label><input type="text" name="authorName"/><br/>

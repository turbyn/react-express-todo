import React from "react";

class SubmitNewCategoryOpened extends React.Component {
  constructor(props){
    super(props);
    this.onCategorySubmit = this.onCategorySubmit.bind(this)
    this.preventPropagation = this.preventPropagation.bind(this);
  }

  onCategorySubmit(e){
    e.preventDefault();
    const newCategory = e.target.categoryName.value;
    if(newCategory.toLowerCase() === 'done'){alert('Reserved category name. Choose different one!');return}
    console.log(newCategory);
    this.props.addCategory(newCategory);
    this.props.hideAddCategory();
  }

  preventPropagation(e){
    e.stopPropagation();
  }



  render() {
    return (
      <li className="waves-effect waves-light collection-item" href="#" onClick={this.preventPropagation} >
        <form id="newCategoryForm" onClick={this.props.preventPropagation} onSubmit={this.onCategorySubmit}>
          <label for="categoryName">New category:</label>
          <input onClick={this.props.preventPropagation} name="categoryName" id="categoryName" autocomplete="off"/>
          <button className="button-transparent"><i class="material-icons cyan-text">check</i></button>
          <i class="material-icons cyan-text" onClick={this.props.hideAddCategory}>cancel</i>
        </form>
      </li>
    );
  }
}

export default SubmitNewCategoryOpened;


/*
<h1>Header {this.props.loginStatus ? <Logout/> : <Login/>}</h1>
*/

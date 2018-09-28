import React from "react";
import ReactDOM from "react-dom";

import Modal from "react-modal";
import axios from "axios";
import Header from "./Header.js";
import Todo from "./Todo.js";
import FormInput from "./FormInput.js";
import UserCreation from "./UserCreation.js"
import Summary from "./Summary.js"
import SubmitNewCategoryOpened from "./SubmitNewCategoryOpened.js";

import Moment from "moment";
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment)
const utils = require("../scripts/utils.js");

class Dashboard extends React.Component {
  constructor(){
    super();
    this.state = {
      notes: [],
      notesPast :  [],
      notesToday :  [],
      notesTomorrow :  [],
      notesWeek :  [],
      notesMonth : [],
      categories: [],
      modalIsOpen: false,
      userAccountName: '',
      currentCategory: '',
      addNewCategoryOpened: false
    };
    this.displayNotesForUser = this.displayNotesForUser.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.createNote = this.createNote.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.changeUserName = this.changeUserName.bind(this);
    this.returnNotesForCategory = this.returnNotesForCategory.bind(this);
    this.onCategoryClick = this.onCategoryClick.bind(this);
    this.AddCategoryOnClick = this.AddCategoryOnClick.bind(this);
    this.displayAddCategory = this.displayAddCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.getNumberOfNotesForCategory = this.getNumberOfNotesForCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.processNotes = this.processNotes.bind(this);
    this.hideAddCategory = this.hideAddCategory.bind(this);
    this.completeTodo = this.completeTodo.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
    this.onDoneClick = this.onDoneClick.bind(this);
    this.onSummaryClick = this.onSummaryClick.bind(this);
    this.renderInput = this.renderInput.bind(this);
    }

  componentDidMount(){
    this.displayNotesForUser();
    this.checkUserAccount();
  }

  changeUserName(userName){
    this.setState(() => {
      return ({userAccountName : userName})
    })
  }

  toggleModal(){
    this.setState((prevState) => {
      return ({modalIsOpen : !prevState.modalIsOpen})
    })
  }

  checkUserAccount(){
    axios.get('/api/current_user').then((res) => {
      if(!res.data.userName || res.data.userName == "Undefined"){  //to change condition
        this.toggleModal();
      }else{
        this.changeUserName(res.data.userName);
      }

      this.setState(() => {
        return ({categories : res.data.categories})
      })

    })
  }

  displayNotesForUser(){
    axios.get('/getNotes').then((response) => {
      this.setState(() => {
        return ({notes: response.data});
      });
      this.processNotes();
    }).catch((e) => {
      alert('Error! - '+e);
    })
  }

  displayMessage(message){
    alert(message);
  }

  removeTodo(id){
    this.setState((prevState) => {
      return ({notes : prevState.notes.filter((individualNote) => {
        return individualNote._id !== id;
      })})
    })
    axios.get(`/removeNote/${id}`)
    .then((result) => {
      console.log(result);
    })
    .catch((e) => {
      alert('Error: '+e)
    })
  }

  completeTodo(id){
    axios.get(`/completeNote/${id}`)
    .then((result) => {
      console.log(result);
      this.setState((prevState) => {
        return ({notes : prevState.notes.map((individualNote) => {
          if(individualNote._id == id){
            return individualNote.category = "done";
          }else{
            return individualNote
          }
        })})
      })
    })
    .catch((e) => {
      alert('Error: '+e)
    })
  }

  onSummaryClick(){
    document.querySelectorAll('li.active').forEach((item) => {
      item.classList.remove('active');
    })

    this.setState(() => {
      return ({currentCategory : ""});
    })
    document.querySelectorAll('#summaryCategory')[0].classList.add("active");
  }

  onDoneClick(){
    this.forceUpdate();
    document.querySelectorAll('li.active').forEach((item) => {
      item.classList.remove('active');
    })
    this.setState(() => {
      return ({currentCategory : 'done'});
    })
    document.querySelectorAll('#doneCategory')[0].classList.add("active");
  }

  onCategoryClick(e){
    document.querySelectorAll('li.active').forEach((item) => {
      item.classList.remove('active');
    })

    let targetedCategoryText = e.target.childNodes[0].textContent
    let targetedNode = e.target
    if(e.target.localName === "span"){
      targetedNode = targetedNode.parentElement;
    }
    targetedNode.classList.add("active");
    this.setState(() => {
      return ({currentCategory : targetedCategoryText})
    })
  }

  createNote(note){
    axios({
      method:'post',
      url:'/addTodo',
      data: note
      }).then((response) => {
      this.setState((prevState) => {
        return ({notes : [response.data,...prevState.notes]})
      })
      this.processNotes()
    })
  }

  returnNotesForCategory(){
      return this.state.notes.filter((note) => {
        return note.category === this.state.currentCategory
      })
    }

  addCategory(category){
    if(category.trim().length < 4){return alert('Note category should have at least 4 characters')}
    axios({
      method:'post',
      url:'/addCategory',
      data: {category}
    }).then((response) => {
      this.setState((prevState) => {
        return ({categories : [...prevState.categories,category]})
      })
    })
  }

  AddCategoryOnClick(){
    this.setState(() => {
      return ({addNewCategoryOpened: true});
    })
  }

  hideAddCategory(){
    this.setState(() => {
      return ({addNewCategoryOpened : false})
    })
  }

  displayAddCategory(){
    if(this.state.addNewCategoryOpened){
      return <SubmitNewCategoryOpened onClick={this.preventPropagation} preventPropagation={this.preventPropagation} addCategory={this.addCategory} hideAddCategory={this.hideAddCategory}/>
    }else{
      return ( <ul onClick={this.preventPropagation} onClick={this.AddCategoryOnClick}><li className="waves-effect waves-light collection-item" href="#">New category</li></ul> )
    }
  }

  preventPropagation(e){
    e.stopPropagation();
  }

  getNumberOfNotesForCategory(categoryName){
    let numberOfCategories = this.state.notes.filter((note) => {
      return note.category === categoryName
    }).length

    if(numberOfCategories === 0){return ''}else{return numberOfCategories}
  }

  deleteCategory(categoryName){
    let numberOfNotes = this.state.notes.filter((note) => {
      return note.category === categoryName
    }).length

    if(!confirm(`Are you sure you want to delete category ${categoryName}? That will remove ${numberOfNotes} notes.`)){return;}

    let notesToBeDeleted = this.state.notes.filter((individualNote) => {
      return individualNote.category === categoryName;
    }).map((item) => {
      return item._id
    })

    axios({
      method:'post',
      url:'/removeNotesAndCategory',
      data: {notesArray:notesToBeDeleted,category:categoryName}
    }).then((response) => {
      this.setState((prevState) => {
        return ({notes : prevState.notes.filter((individualNote) => {
          return individualNote.category !== categoryName;
        })})
      })

      this.setState((prevState) => {
        return ({ categories : prevState.categories.filter((individualCategory) => {
          return individualCategory !== categoryName
        })})
      })

    })
  }

  renderCategories(){
    return this.state.categories.map((itemObject) => {
      return (
          <li className="collection-item" href="#" onClick={this.onCategoryClick}><span name="categoryName">{itemObject}</span>
            <span className="badge right-align">{this.getNumberOfNotesForCategory(itemObject)}</span>
          </li>
        )
    })
  }

  processNotes(){
    const referenceDate = moment();
    const today = moment().clone().startOf('day');
    const tomorrow = moment().clone().add(1, 'day').startOf('day');
    const weekRange = moment.range(referenceDate.clone().add(2, 'day').startOf('day'),referenceDate.clone().add(7, 'day').startOf('day'))
    const monthRange = moment.range(referenceDate.clone().add(8, 'day').startOf('day'),referenceDate.clone().add(30, 'day').startOf('day'))
    const receivedNotes = this.state.notes;
    console.log(receivedNotes)
      this.setState(() => {
        return({
          notesPast : receivedNotes.filter((individualNote) => {
                        return individualNote.deadline < Date.now() && individualNote.category !== "done";
                      }),
          notesToday : receivedNotes.filter((individualNote) => {
                        return moment(individualNote.deadline).isSame(today, 'd') && individualNote.category !== "done";
                      }),
          notesTomorrow : receivedNotes.filter((individualNote) => {
                        return moment(individualNote.deadline).isSame(tomorrow, 'd') && individualNote.category !== "done";
                      }),
          notesWeek : receivedNotes.filter((individualNote) => {
                        return weekRange.contains(moment(individualNote.deadline)) && individualNote.category !== "done";
                      }),
          notesMonth : receivedNotes.filter((individualNote) => {
                        return monthRange.contains(moment(individualNote.deadline)) && individualNote.category !== "done";
                      })
        });
      })
 }

renderInput(){
  return(<FormInput
    postNote={this.createNote}
    deleteCategory={this.deleteCategory}
    userAccountName={this.state.userAccountName}
    currentCategory={this.state.currentCategory}
    returnToSummary={this.onSummaryClick}
  />)
}

  render() {
    return (
      <div>
        <Header loginStatus={this.props.loginStatus}/>
          <div>
            <div className="row">
              <div className="col s3">

                <ul className="collection">
                  <li id="doneCategory" className="collection-item" onClick={this.onDoneClick}>Done</li>
                </ul>


                <ul className="collection">
                  {this.renderCategories()}
                </ul>
                <ul className="collection"><li>{this.displayAddCategory()}</li></ul>

              </div>

              <div className="col s9">
              {(this.state.currentCategory !== 'done' && this.state.currentCategory !== '') && this.renderInput()}

                {this.returnNotesForCategory().map((itemObject) => {
                  return (
                    <div>
                    <Todo key={itemObject.id}
                          author={itemObject.author}
                          content={itemObject.content}
                          timestamp={itemObject.timestamp}
                          title={itemObject.title}
                          id={itemObject._id}
                          deadline={itemObject.deadline}
                          removeTodo={this.removeTodo}
                          completeTodo={this.completeTodo}
                          category={itemObject.category}
                     /></div>
                )
                })}

              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Dashboard;

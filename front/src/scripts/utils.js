const $ = require('jquery');

function addNew(e){

  console.log(e);
  console.log('Im working!');
  console.log($(e.target).html(`
    <li class="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
    `));
}

module.exports = {
  addNew:addNew
};

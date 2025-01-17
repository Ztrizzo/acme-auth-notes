import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNotes, deleteNote } from './store';
import NewNote from './NewNote';

class Notes extends Component {

  async componentDidMount(){
    console.log('cdm');
    await this.props.getNotes();
  }


  render(){
    const {notes} = this.props;
    return(
      <div>
        <Link to='/home'>Home</Link>
        <div>
          <ul>
            {notes.map((note) => {
              return <li key={note.id}>
                <Link to={`/notes/${note.id}`} >{note.txt}</Link>
                <button onClick={() => this.props.deleteNote(note.id)}>x</button>
              </li>
            })}
            
          </ul>
        </div>
        <NewNote/>
      </div>
    )
  } 
    
  
};

const mapDispatchToProps = (dispatch) => {
  return{
    getNotes: function(){
      dispatch(getNotes());
    },
    deleteNote: function(noteId){
      dispatch(deleteNote(noteId));
    }
  }
}

export default connect(state => state, mapDispatchToProps)(Notes);

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNotes } from './store';
import NewNote from './NewNote';

class Notes extends Component {

  async componentDidMount(){
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
              return <Link to={`/notes/${note.id}`} key={note.id}><li>{note.txt}</li></Link>
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
    }
  }
}

export default connect(state => state, mapDispatchToProps)(Notes);

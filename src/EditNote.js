import React from 'react';
import { connect } from 'react-redux';
import { editNote } from './store';
class EditNote extends React.Component{
  constructor(props){
    super(props);
    const noteToBeEdited = this.props.notes.find(note => note.id === this.props.match.params.id * 1);
    this.state = {
      editNote: noteToBeEdited.txt
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(evt){
    this.setState({
      editNote: evt.target.value
    })
  }

  componentDidUpdate(prevProps){
    if(prevProps.match.params.id !== this.props.match.params.id){
      const noteToBeEdited = this.props.notes.find(note => note.id === this.props.match.params.id * 1);
      this.setState({
        editNote: noteToBeEdited.txt
      })
    }

  }

  onSubmit(evt){
    evt.preventDefault();
    this.props.editNote(this.state.editNote, this.props.match.params.id * 1)
    this.props.history.push('/notes');
  }

  render(){
    return(
      <form onSubmit={this.onSubmit}>
        <input value={this.state.editNote} onChange={this.onChange}/>
        <button>Edit</button>
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    editNote: function(txt, noteId){
      dispatch(editNote(txt, noteId))
    }
  }
}

export default connect(state => state, mapDispatchToProps)(EditNote);
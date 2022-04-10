import React from 'react';
import { connect } from 'react-redux';
import { editNote } from './store';
class EditNote extends React.Component{
  constructor(){
    super();
    this.state = {
      editNote: ''
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(evt){
    this.setState({
      editNote: evt.target.value
    })
  }

  onSubmit(evt){
    evt.preventDefault();
    this.props.editNote(this.state.editNote, this.props.match.params.id)
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

export default connect(null, mapDispatchToProps)(EditNote);
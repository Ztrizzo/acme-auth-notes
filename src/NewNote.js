import React from "react";
import { Component } from "react";
import { newNote } from "./store";
import { connect } from "react-redux";

class NewNote extends Component{
  constructor(){
    super();
    this.state = {
      newNote: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(evt){
    this.setState({
      newNote: evt.target.value
    })
  }

  onSubmit(evt){
    evt.preventDefault();
    this.props.newNote(this.state.newNote);
    this.setState({
      newNote: ''
    })
  }

  render(){
    return (
      <form onSubmit={this.onSubmit}>
        <input value={this.state.newNote} onChange={this.onChange}/>
        <button>Create</button>
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newNote: function(txt){
      dispatch(newNote(txt));
    }
  }
}

export default connect(null, mapDispatchToProps)(NewNote);
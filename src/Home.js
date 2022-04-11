import React from 'react';
import { connect } from 'react-redux';
import { logout, getNotes } from './store';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Home = ({ auth, logout, notes, getNotes})=> {
  useEffect(() => {
    getNotes();
  }, []);
  return (
    <div>
      Welcome { auth.username }
      <button onClick={ logout }>Logout</button>
      <div>
        You have added { notes.length } notes.
        <br />
        <Link to='/notes'>Access and Add Notes</Link>
      </div>
    </div>
  );
};

const mapState = state => state;
const mapDispatch = (dispatch)=> {
  return {
    logout: ()=> {
      return dispatch(logout());
    },
    getNotes: ()=> {
      dispatch(getNotes())
    }
  }
}


export default connect(mapState, mapDispatch)(Home);

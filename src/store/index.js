import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const notes = (state = [], action)=> {
  if(action.type === 'GET_NOTES'){
    return action.notes;
  }
  if(action.type === 'EDIT_NOTES'){
    return action.notes;
  }
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

const editNote = (txt, noteId) => {
  return async(dispatch) => {
    const notes = (await axios.put('/api/notes', {txt, noteId}, {
      headers:{
        authorization: window.localStorage.token
      }
    })).data

    dispatch({
      type: 'EDIT_NOTE',
      notes
    })
  }
}

const newNote = (txt) => {
  return async(dispatch) => {
    const notes = (await axios.post('/api/notes', {txt}, {
      headers: {
        authorization: window.localStorage.token
      }
    })).data;

    console.log(notes);

  }
}

const getNotes = () => {
  return async(dispatch)=> {
    const notes = (await axios.get('/api/notes', {
      headers: {
        authorization: window.localStorage.token
      }
    })).data;


    console.log(notes);
    dispatch({
      type: 'GET_NOTES',
      notes
    })
  }
}

const logout = ()=> {
  window.localStorage.removeItem('token');
  return {
    type: 'SET_AUTH',
    auth: {}
  };
};

const signIn = (credentials)=> {
  return async(dispatch)=> {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    return dispatch(attemptLogin());
  }
};
const attemptLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  }
}

const store = createStore(
  combineReducers({
    auth,
    notes
  }),
  applyMiddleware(thunk, logger)
);

export { attemptLogin, signIn, logout, getNotes, newNote, editNote };

export default store;

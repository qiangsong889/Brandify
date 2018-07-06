import { combineReducers } from 'redux';
import sessionId from './sessionId';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  sessionId: sessionId,
  form: formReducer
});

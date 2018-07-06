export default (state = null, action) => {
  switch (action.type) {
    case 'SESSION_ID':
      return action.payload;
      break;
  }
  return state;
};

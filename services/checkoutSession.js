const sessions = {};

function getSession(phone){

  if(!sessions[phone]){
    sessions[phone] = {
      step: null,
      data: {}
    };
  }

  return sessions[phone];
}

module.exports = { getSession };
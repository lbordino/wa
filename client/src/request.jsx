let SERVER_URL = "http://localhost:3001"

const getRound = async (vec) => {
  const parm = new URLSearchParams({
    first: vec[0],
    second: vec[1],
}).toString();
  const response = await fetch(SERVER_URL + '/api/round?' + parm, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok)
    return await response.json();
  else
    return null;
}

const saveGame = async (game) => {
  const response = await fetch(SERVER_URL + '/api/game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(game),
  });
  return response.ok;

}
const validateAnswer = async (imageId, answer) =>{
  const response = await fetch(SERVER_URL + '/api/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({imageId, answer}),
  });
  if (response.ok)
    return await response.json();
  else
    return null;
}

const getMyGames = async () => {
  const response = await fetch(SERVER_URL + '/api/games', {
    method: 'GET',
    credentials: 'include'
  });
  if (response.ok)
    return await response.json();
  else
    return null;
}

const getLeaderboard = async () => {
  const response = await fetch(SERVER_URL + '/api/leaderboard', {
    method: 'GET',
    credentials: 'include'
  });
  if (response.ok)
    return await response.json();
  else
    return null;
}

const reset = async () => {
  const response = await fetch(SERVER_URL + '/api/game', {
    method: 'DELETE',
    credentials: 'include'
  });
  return response.ok;
}
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

function API() {
  this.logIn = logIn;
  this.logOut = logOut;
  this.getUserInfo = getUserInfo;
  this.getRound = getRound;
  this.saveGame = saveGame;
  this.getMyGames = getMyGames;
  this.getLeaderboard = getLeaderboard;
  this.reset = reset;
  this.validateAnswer = validateAnswer
}


export default API;
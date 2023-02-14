import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_DEMO_USER = 'session/demoUser'

// create POJO action creator to get user
export const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

// create POJO action creator to logout user
export const removeUser = () => ({
    type: REMOVE_USER,
})

export const setDemoUser = (user) => ({
    type: SET_DEMO_USER,
    payload: user
})

// thunk action creator (for restore the session user)
export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

// thunk action creator (for sign up the user)
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    // dispatch(setUser(data.user));
    dispatch(setUser(data))
    return response;
  };

// thunk action creator (login for the user)
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password,
        })
    })

    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}

// thunk action creator (logout the user)
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });
    dispatch(removeUser())
    return response;
}


const initialState = { user: null}

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state)
            newState.user = action.payload
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state)
            newState.user = null;
            return newState
        default:
            return state;
        }
    }

export default sessionReducer

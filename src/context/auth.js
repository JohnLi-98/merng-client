import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
}

if(localStorage.getItem("jwtToken")) {
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

    if(decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = decodedToken;
    }
}

// Create context, where a user object that is initially null, login function that takes in data 
// to do something (placeholder - can be omitted but good practice), and a logout function that takes 
// nothing and does something.
const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

// Reducer - receives an action with a type and a payload and determines what to do with the two depending
// on the functionality of an application.
function authReducer(state, action) {
    // Depending on the type, it will do something.
    switch(action.type) {
        // When logging in, spread the existing state and set the user in our state to this data.
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        // When logging out, clear the data and set the user back to null.
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    // Can use the dispatch to dispatch any action and attach to a type and a 
    // payload, so that the above reducer can listen and perform actions depending on
    // dispatch action
    const [state, dispatch] = useReducer(authReducer, initialState);

    // This function is called when logging in, dispatching the login type with the data, 
    // which will change the data inside the context and set the user to the user details
    // so that the application knows there is a logged in user.
    function login(userData) {
        localStorage.setItem("jwtToken", userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        });
    }

    function logout() {

        localStorage.removeItem("jwtToken");
        dispatch({
            type: 'LOGOUT'
        });
    }

    // Return the provider, so it can be used somewhere else. Pass the user object 
    // with the state, login and logout functions values to the components that are 
    // under this context provider. Also spread the props as they can be received from 
    // the top down component.
    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }
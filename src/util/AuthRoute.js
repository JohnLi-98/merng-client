import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext} from '../context/auth';

function AuthRoute({ component: Component, ...rest }) {
    // Get authenticated user
    const { user } = useContext(AuthContext);

    // If there is an authenticated user, redirect user to current page, otherwise 
    // direct them to the correct page, via the props that were passed in.
    return (
        <Route
            {...rest}
            render={(props) => 
                user ? <Redirect to="/"/> : <Component {...props}/>
            }
        />
    )
}

export default AuthRoute;
import React from 'react';
import App from './App';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
// Retrieves the token from localStorage and adds it to the authoriation automatically instead of adding 
// it each time you send a request. Acts as a middleware, so it sets a context of a request and modifies
// whatever you want to do before the reuest is sent to the http link.
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
});

// This adds the token to the request
const authLink = setContext(() => {
    // Gets the token from localStorage
    const token = localStorage.getItem('jwtToken');
    // Sets the authorisation header if there is a token, otherwise leave it blank.
    return{
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
});

// Sends protected api calls/requests with the authorisation link.
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});



export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)
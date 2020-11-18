import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
    // context holds a user object, login and logout function
    const context = useContext(AuthContext);
    // If there is any errors during the registeration, they are set into errors. Default state is an 
    // empty object.
    const [errors, setErrors] = useState({})

    // Extract the state from the useForm hook with the loginUser function as the callback and the initial state 
    // of the login form, whenever the onChange or onSubmit event is fired.
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '',
        password: ''
    })

    // Mutation function to authenticate user when the submit button is clicked.
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        // update() is triggered if the mutation is successfully executed. Gets the proxy (meta data - rarely used
        // and omitted and replaced with an underscore instead) and the result of the mutation.
        update(_, { data: { login: userData}}) {
            //console.log(result.data.login);
            context.login(userData)
            props.history.push('/');
        },
        // If there was an error, the object that holds all the errors from the server side will be set into the
        // errors state.
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />

                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username password: $password
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Login;
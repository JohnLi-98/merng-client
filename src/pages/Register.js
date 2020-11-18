import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props) {
    const context = useContext(AuthContext);
    // If there is any errors during the registeration, they are set into errors. Default state is an 
    // empty object.
    const [errors, setErrors] = useState({})

    // Extract the state from the useForm hook with the addUser function as the callback and the initial state of 
    // the registration form, whenever the onChange or onSubmit event is fired.
    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Mutation function to register user when the submit button is clicked.
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        // update() is triggered if the mutation is successfully executed. Gets the proxy (rarely used - meta data
        // and omitted and replaced with an underscore instead) and the result of the mutation.
        update(_, { data: { register: userData}}) {
            //console.log(result.data.logout);
            context.login(userData);
            props.history.push('/');
        },
        // If there was an error, the object that holds all the errors from the server side will be set into the
        // errors state.
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    // Workaround for the addUser() function not being recognised before the declaration. In JS, all functions with
    // the keyword function in front, are brought up and read through initially. So, with this way, the registerUser
    // function is recognised further up.
    function registerUser() {
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Register</h1>
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
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
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

                <Form.Input
                    label="ConfirmPassword"
                    placeholder="Confirm Password..."
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Register;
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';
 
function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            // Access the cache through proxy.readQuery() to get the client's data for getPosts
            // to add the post to the page once posted. The cache data is stored inside of getPosts,
            // within the data variable.
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            // Edits the getPosts entry by opening an array to add the post to the top, with 
            // result.data.createPost, where the response is stored and spread the existing getPosts.
            // Use writeQuery() to persist the data, before emptying the body of values.
            //data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({ 
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            });
            values.body = '';
        },
        onError(err) {
            // Added so unhandled rejection (error) would not show
        }
    })

    function createPostCallback() {
        createPost();
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Hi World!"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />

                <Button type="submit" color="teal">
                    Submit
                </Button>
            </Form.Field>
        </Form>

        {error && (
            <div className="ui error message" style={{marginBottom: "20px"}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

export default PostForm;
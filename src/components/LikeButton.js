import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Icon, Label } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup';

// The like button should be outlined if there is no user logged in, as well as when a user
// has not previously liked. Only filled in if the logged in user has already liked the post.
// Also, if user is not logged in and clicks the like button, they will be redirected to login 
// page.
function LikeButton({ user, post: { id, likes, likeCount } }) {
    const [liked, setLiked] = useState(false);

    // callback will check if there is logged in user and whether any of the likes on a this 
    // post matches with the username of the authenticated user. If it does, set the liked Boolean
    // to true, otherwise to false.
    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes]) // <-- Dependancies array of the user and likes, so if these change, recalculate the value.

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        errorPolicy: 'ignore' // <-- Ignore errors that this mutation produces (nothing to do with like functionality).
        /*
        onError(err) { // <-- Gets rid of authorisation header not provided error when redirected to login page.
            console.log(err);
        }
        */
    })
    
    const likeButton = user ? (
        liked ? (
            <Button color="teal">
                <Icon name="heart" />
            </Button>
        ) : (
            <Button color="teal" basic>
                <Icon name="heart" />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color="teal" basic>
            <Icon name="heart" />
        </Button>
    )
    
    return (
        <Button as="div" labelPosition="right" onClick={likePost}>
            <MyPopup content={liked ? 'Unlike' : 'Like'}>
                {likeButton}
            </MyPopup>
            
            <Label basic color="teal" pointing="left">
                {likeCount}
            </Label>
        </Button>
    )
}

// By specifying the id of the post that we are getting back, we get back a resource of type post
// and Apollo realises this, so it automatically updates the post with any of fields listed, meaning
// that we do not have to update it in the cache memory of the browser with readQuery() and writeQuery().
const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`

export default LikeButton;
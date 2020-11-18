import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
    // Values of the form are set into values. Default state of each field is an empty string.
    const [values, setValues] = useState(initialState);

    // If the onChange event is fired, run setValues to change the state of values.
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const onSubmit = event => {
        event.preventDefault();
        callback();
    }

    return {
        onChange,
        onSubmit,
        values
    }
}
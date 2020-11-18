// This file is used for outsourcing the popup into it's own component, not
// the best use case for this project but it is to show good practice of mini 
// elements that are shared across your project/app.

import React from 'react'
import { Popup } from 'semantic-ui-react';

function MyPopup({ content, children}) {
    return <Popup inverted content={content} trigger={children} />
}

export default MyPopup;
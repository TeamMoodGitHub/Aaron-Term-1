import React from 'react';

const logo = (props) => (props.size === "large") ? 
(<h1 className="logo-large">Jungle.GG</h1>)
:
(<h4 className="logo">Jungle.GG</h4>);

export default logo;
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
module.exports = class Compare {

    constructor(props){
        ReactDOM.render(<App config={props}/>, document.getElementById(props.selector));
    }
}

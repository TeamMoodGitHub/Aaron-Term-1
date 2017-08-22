import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    text: "Hi..."
  };

  componentDidMount() {
    this.loadText();
  };

  loadText() {
    fetch("/api")
      .then(res => res.json())
      .then(text => this.setState({text}));
  }

  render() {
    return (
      <div className="App">
        <h1>TEXT: {this.state.text}</h1>
      </div>
    );
  }
}

export default App;

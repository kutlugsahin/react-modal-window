import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Modal from './modal';
class App extends Component {
  state = {
    isModalOpen: false,
  }

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
  }  

  render() {
    return (
      <div className="App">
        <button onClick={this.openModal}>Toggle window</button>
        <Modal snapToWindow draggable overlay isOpen={this.state.isModalOpen} onClose={() => this.setState({isModalOpen: false})}>

        </Modal>
      </div>
    );
  }

  openModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
}

export default App;

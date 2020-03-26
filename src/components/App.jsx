import React from 'react';
import logo from '../images/fern.png';
import '../styles/App.css';
import TaskList from './TaskList';

// Temporary values
let items = [
  'Delete a task by clicking the X button',
  'Edit a task by clicking the \u270e button',
  'Click Enter after editing to save your changes',
];
items = items.map((item, index) => ({
  id: index,
  value: item,
  isBeingEdited: false,
  currentValue: item,
}));

function App() {
  return ( // TODO: Add links
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Spring.
        </p>
        <p>
          Your to-do list can be found below.
        </p>
      </header>
      <TaskList items={items} />
    </div>
  );
}

export default App;

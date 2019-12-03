import React from 'react';
import logo from './fern.png';
import './App.css';
import TaskList from './TaskList';

// Temporary values
let items = ['Create planner', 'Study networking', 'Prepare for camp'];
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
          Scroll down to see your first to-do list.
        </p>
      </header>
      <TaskList items={items} />
    </div>
  );
}

export default App;

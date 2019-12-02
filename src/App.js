import React from 'react';
import logo from './fern.png';
import './App.css';
import TaskList from './TaskList';

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
        <TaskList items={items}/>
      </div>
  );
}

// Temporary values
let items = ["Create planner", "Study networking", "Prepare for camp"];

export default App;

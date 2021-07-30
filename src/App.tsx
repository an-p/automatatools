import React from 'react';
import './App.css';
import MinDFAComponent from './ui/algorithms/MinDFAComponent';
import ToolLinks from './ui/ToolLinks';

function App() {
  return (
    <div>
      <h1>Minimize DFA</h1>
      <MinDFAComponent/>
      <h1>Other useful tools</h1>
      <ToolLinks/>
      <hr/>
      <a href="https://github.com/an-p/automatatools" rel="noreferrer" target="_blank">GitHub</a>
    </div>
  );
}

export default App;

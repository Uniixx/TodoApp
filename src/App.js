import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

import Index from "./pages/index";

function App() {
  return (
   <Router>
     <Route exact path="/" component={Index} />
   </Router>
  );
}

export default App;

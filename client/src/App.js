import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useSelector } from 'react-redux'
import Auth from './pages/auth'
import ForgotPassword from './pages/forgotPassword'
import Verify from './pages/verify'
import Home from './pages/home'
import React from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
        <Switch>
          <Route path="/auth">
            <Auth/>
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword/>
          </Route>
          <Route path="/verify/:accountId">
            <Verify/>
          </Route>
          <Route path="/" exact={true}>
            <Redirect to="/task"/>
          </Route>
          <Route path="/task">
            <Home/>
          </Route>
          <Route path="*">
            <h1>not found</h1>
          </Route>
        </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;

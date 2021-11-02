import React from 'react';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Histogram from './componentts/LineChart';
import Home from './pages/Home';
import Nav from './componentts/Nav';

function App() {
  return (
    <Router>

      <Nav />
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/" component={Home} />

        </Switch>
      </Container>
    </Router>

  );
}

export default App;

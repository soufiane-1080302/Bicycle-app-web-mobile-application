import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Settings from './Settings';
import WeatherIndicator from './WeatherIndicator';
import LocationsOverview from './LocationsOverview';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Home = () => {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <Link className="navbar-brand" to="/">Fiets Indicator App</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/settings">Instellingen</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/weather">Weerindicator</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/locations">Overzicht van Locaties</Link></li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/settings/:id?">
            <Settings />
          </Route>
          <Route path="/weather/:id?">
            <WeatherIndicator />
          </Route>
          <Route path="/locations">
            <LocationsOverview />
          </Route>
          <Route path="/">
            <div className="text-center">
              <h1>Welkom bij de Fiets Indicator App</h1>
              <p>Bekijk het fietsweer en beheer je instellingen om de beste fietservaring te hebben!</p>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Home;

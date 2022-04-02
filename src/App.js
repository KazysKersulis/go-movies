import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Admin from "./components/Admin";
import Home from "./components/Home";
import Movies from "./components/Movies";
import OneMovie from "./components/OneMovie";
import Genres from "./components/Genres";
import OneGenre from "./components/OneGenre";
import EditMovie from "./components/EditMovie";

export default function App() {
  return (
    <Router>
      <div className="container">
        <div className="row">
          <h1 className="mt-3">
            Go Watch A Movie
          </h1>
          <hr className="mb-3"></hr>
        </div>
        <div className="row">
          <div className="col-md-2">
            <nav>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/movies">Movies</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/genres">Genres</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin/movie/0">Add Movie</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin">Manage Catalogue</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route path="/movies/:id" component={OneMovie} />
              <Route path="/movies" component={Movies}>
                <Movies />
              </Route>
              <Route path="/genre/:id" component={OneGenre} />
              <Route exact path="/genres">
                <Genres />
              </Route>
              <Route path="/admin/movie/:id" component={EditMovie} />

              <Route path="/admin" component={Admin}>
                <Admin />
              </Route>
              <Route path="/" component={Home}>
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

import React, { Component } from 'react';
import Ticket from './../images/movie_tickets.jpg'
import "./Home.css"

export default class Home extends Component {
  render() {
    return (
      <div className="text-center">
        <h2>Home</h2>
        <hr />
        <div className='ticket'></div>
      </div>
    )
  }
}

import React, { Component, Fragment } from "react";
import "./EditMovie.css"
import Input from "./form-components/Input";

export default class EditMovie extends Component {
  state = {
    movie: {},
    isLoaded: false,
    error: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      movie: {
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        rating: "",
        description: "",
      },
      isLoaded: false,
      error: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

  }

  handleSubmit = (event) => {
    console.log("Form was submited");
    event.preventDefault();
  }

  handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value,
      }
    }))
  }

  render() {
    let { movie } = this.state;

    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" id="id" value={movie.id} onChange={this.handleChange} />
          <Input
            id={'title'}
            title={"Title"}
            type={'text'}
            name={'title'}
            value={movie.title}
            handleChange={this.handleChange}
          />

          <Input
            id={'release_date'}
            title={"Release Date"}
            type={'date'}
            name={'release_date'}
            value={movie.release_date}
            handleChange={this.handleChange}
          />

          <Input
            id={'runtime'}
            title={"Runtime"}
            type={'text'}
            name={'runtime'}
            value={movie.runtime}
            handleChange={this.handleChange}
          />

          <div className="mb-3">
            <label htmlFor="mpaa_rating" className="form-label">
              MPAA Rating
            </label>
            <select className="form-select" value={movie.mpaa_rating} name="mpaa_rating" onChange={this.handleChange}>
              <option className="form-select">Choose...</option>
              <option className="form-select" value="G">G</option>
              <option className="form-select" value="PG">PG</option>
              <option className="form-select" value="PG13">PG13</option>
              <option className="form-select" value="R">R</option>
              <option className="form-select" value="NC17">NC17</option>
            </select>
          </div>

          <Input
            id={'rating'}
            title={"Rating"}
            type={'text'}
            name={'rating'}
            value={movie.rating}
            handleChange={this.handleChange}
          />

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={movie.description}
              onChange={this.handleChange} />
          </div>

          <hr />

          <button className="btn btn-primary">Save</button>

        </form>

        <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div>

      </Fragment>
    )
  }
}

import React, { Component, Fragment } from "react";
import "./EditMovie.css"
import Input from "./form-components/Input";
import Select from "./form-components/Select";

export default class EditMovie extends Component {

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
      mpaaOptions: [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
      ],
      isLoaded: false,
      error: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id
    if (id > 0) {
      fetch("http://localhost:4000/v1/movie/" + id)
        .then((response) => {
          if (response.status !== "200") {
            let err = Error;
            err.Message = "Invalid response code: " + response.status;
            this.setState({ error: err });
          }
          return response.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);
          this.setState({
            movie: {
              id: id,
              title: json.movie.title,
              release_date: releaseDate.toISOString().split("T")[0],
              runtime: json.movie.runtime,
              mpaa_rating: json.movie.mpaa_rating,
              rating: json.movie.rating,
              description: json.movie.description,
            },
            isLoaded: true,
          },
            (error) => {
              this.setState({
                isLoaded: true,
                error,
              })
            })
        })
    } else {
      this.setState({ isLoaded: true })
    }
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
    let { movie, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading...</p>
    } else {

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

            <Select
              title={"MPAA Rating"}
              name={"mpaa_rating"}
              value={movie.mpaa_rating}
              handleChange={this.handleChange}
              options={this.state.mpaaOptions}
              placeholder={"Choose..."}
            />

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
}
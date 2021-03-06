import React, { Component, Fragment } from "react"
import { Link } from "react-router-dom"
import "./EditMovie.css"
import Input from "./form-components/Input"
import Select from "./form-components/Select"
import Alert from "./ui-components/Alert"
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

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
      errors: [],
      alert: {
        type: "d-none",
        message: ""
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.jwt === "") {
      this.props.history.push({
        pathname: "/login",
      });
      return;
    }
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
    event.preventDefault();

    // client side validation
    let errors = [];
    if (this.state.movie.title === "") {
      errors.push("title");
    }

    this.setState({errors: errors})

    if (errors.length > 0) {
      return false;
    }
    
    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append("Authorization", "Bearer " + this.props.jwt)

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: myHeaders,
    }

    fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({
            alert: { type: "alert-danger", message: data.error.message }
          })
        } else {
          this.props.history.push({
            pathname: "/admin",
          })
        }
      });
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

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1; 
  }

  confirmDelete = (e) => {
    confirmAlert({
      title: 'Delete Movie?',
      message: 'Are you sure?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.props.jwt);

            fetch("http://localhost:4000/v1/admin/deletemovie/" + this.state.movie.id, { method: "GET", headers: myHeaders})
              .then(response => response.json)
              .then(data => {
                if (data.error) {
                  this.setState({
                    alert: {type: "alert-danger", message: data.error.message}
                  })
                } else {
                  this.props.history.push({
                    pathname: "/admin",
                  })
                }
              })
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
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
          <Alert
            alertType={this.state.alert.type}
            alertMessage={this.state.alert.message}
          />
          <hr />
          <form onSubmit={this.handleSubmit}>
            <input type="hidden" name="id" id="id" value={movie.id} onChange={this.handleChange} />
            <Input
              id={'title'}
              className={this.hasError("title") ? "is-invalid" : ""}
              title={"Title"}
              type={'text'}
              name={'title'}
              value={movie.title}
              handleChange={this.handleChange}
              errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
              errorMsg={"Please enter a title"}
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
            <Link to="/admin" className="btn btn-warning ms-1">
              Cancel
            </Link>
            {movie.id > 0 && (
              <a href="#!" onClick={() => this.confirmDelete()}
              className="btn btn-danger ms-1">
                Delete
              </a>
            )}
          </form>
        </Fragment>
      )
    }
  }
}

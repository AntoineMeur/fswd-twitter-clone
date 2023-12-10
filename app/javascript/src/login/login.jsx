
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import {safeCredentials, handleErrors } from '@utils/fetchHelper';

import './login.scss';

class Login extends React.Component {



  state = {
    signInUsername: '',
    signInPassword: '',
    signUpUsername: '',
    signUpEmail: '',
    signUpPassword: '',
    error: '',
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  signIn = (e) => {
    if (e) e.preventDefault();
    this.setState({
      error: '',
    });
    fetch('/api/sessions', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          username: this.state.signInUsername,
          password: this.state.signInPassword,
        },
      }),
    }))
      .then(handleErrors)
      .then(data => {
        if (data.success) {
          const params = new URLSearchParams(window.location.search);
          const redirect_url = params.get('redirect_url') || '/';
          window.location = redirect_url;
        }
      })
      .catch(error => {
        this.setState({
          error: 'Could not log in.',
        });
      });
  };

  signUp = (e) => {
    if (e) e.preventDefault();
    this.setState({
      error: '',
    });
    fetch('/api/users', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          email: this.state.signUpEmail,
          password: this.state.signUpPassword,
          username: this.state.signUpUsername,
        },
      }),
    }))
      .then(handleErrors)
      .then(data => {
        if (data.user) {
          this.signIn();
        }
      })
      .catch(error => {
        this.setState({
          error: 'Could not sign up.',
        });
      });
  };


  render() {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6 margin">
              <h1>Welcome to Twitter</h1>
              <p>
                Connect with your friends — and other fascinating people. Get
                in-the-moment updates on the things that interest you. And
                watch events unfold, in real time, from every angle.
              </p>
              <p className="margin">by Antoine M. 2023</p>
            </div>
  
            <div className="col-md-6">
              <form className="border p-3" onSubmit={this.signIn}>
                <div className="form-group">
                  <label htmlFor="signInUsernam">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="signInUsername"
                    placeholder="Enter your username"
                    name="signInUsername"
                    value={this.state.signInUsername}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signInPassword">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="signInPassword"
                    placeholder="Enter your password"
                    name="signInPassword"
                    value={this.state.signInPassword}
                    onChange={this.handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Sign In
                </button>
              </form>
  
              <form className="mt-4 border p-3" onSubmit={this.signUp}>
                <h5>New to Twitter? Sign up!</h5>
                <div className="form-group">
                  <label htmlFor="signUpUsername">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="signUpUsername"
                    placeholder="Choose a username"
                    name="signUpUsername"
                    value={this.state.signUpUsername}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signUpEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="signUpEmail"
                    placeholder="Enter your email"
                    name="signUpEmail"
                    value={this.state.signUpEmail}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signUpPassword">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="signUpPassword"
                    placeholder="Choose a password"
                    name="signUpPassword"
                    value={this.state.signUpPassword}
                    onChange={this.handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
  


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement('div')),
  );
});

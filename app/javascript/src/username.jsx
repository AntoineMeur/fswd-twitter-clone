import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import {safeCredentials, handleErrors } from '@utils/fetchHelper';

import './username.scss';

class Username extends React.Component {
  state = {
    tweets: [],
    loading: true,
    newTweetContent: '', 
    username: "",
    userpage: window.location.pathname.replace('/', '')
  }

  componentDidMount() {
    fetch('/api/authenticated')
    .then(handleErrors)
    .then(data => {
      console.log(data);
      this.setState({
        username: data.username,
      });
    })
    .catch(error => {
      console.error('Error fetching authenticated user:', error);
    });

    this.fetchTweets();
  }

  fetchTweets = () => {
    fetch('/api/tweets')
      .then(handleErrors)
      .then(data => {
        console.log(data);

        this.setState({
          tweets: data.tweets,
          loading: false,
        })
      })
  }

  handleNewTweetChange = (event) => {
    this.setState({
      newTweetContent: event.target.value,
    });
  }

  handlePostTweet = () => {
    const { newTweetContent } = this.state;

    fetch('/api/tweets', safeCredentials({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newTweetContent }),
    }))
      .then(handleErrors)
      .then((data) => {
        this.fetchTweets();
      })
      .catch((error) => {
        console.error('Error posting tweet:', error);
      });
  }


  handleDeleteTweet = (tweetId) => {
    fetch(`/api/tweets/${tweetId}`, safeCredentials({
      method: 'DELETE',
    }))
      .then(handleErrors)
      .then(() => {
        this.setState((prevState) => ({
          tweets: prevState.tweets.filter(tweet => tweet.id !== tweetId),
        }));
      })
      .catch((error) => {
        console.error('Error deleting tweet:', error);
      });
  }


  handleLogout = () => {
    fetch('/api/sessions', {
      method: 'DELETE',
    })
      .then(handleErrors)
      .then(() => {
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }


  render () {   
    const { tweets, loading, newTweetContent, userpage } = this.state;
    console.log(tweets);
    return (
      <Layout>
        <div className="container pt-4">
          <div className="row align-items-start">
          <div className="col-2"> 
          <div> {this.state.username}  </div> 
          <button onClick={this.handleLogout}>log out</button> 
          </div>
            <div className="col-10 mb-4">
              <textarea
                value={newTweetContent}
                onChange={this.handleNewTweetChange}
                placeholder="Composez votre tweet..."
                className="Textarea"
              />
              <button onClick={this.handlePostTweet} className="mb-4">Post</button>

              <div>
              {tweets.map(tweet => {
                console.log(tweet.username);
                console.log(userpage);
                if (tweet.username === this.state.userpage) {
                  return (
                    <div key={tweet.id} className="col-12 mb-4 tweet"> 
                      <a href="#">{tweet.username}</a>                   
                      <p>{tweet.message}</p>
                      {this.state.userpage === this.state.username ? (
                        <button onClick={() => this.handleDeleteTweet(tweet.id)}>Delete</button>
                      ) : null}
                    </div>
                  );
                } 
              })}
            </div>
          </div>
          </div>
          {loading && <p>loading...</p>}
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Username />,
    document.body.appendChild(document.createElement('div')),
  )
})
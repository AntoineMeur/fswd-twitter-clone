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
  }

  componentDidMount() {
    fetch('/api/user/:username/tweets')
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
        this.setState((prevState) => ({
          tweets: [...prevState.tweets, data.tweet],
          newTweetContent: '', 
        }));
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
    const { tweets, loading, newTweetContent } = this.state;
    console.log(tweets);
    return (
      <Layout>
        <div className="container pt-4">
          <div className="row align-items-start">
          <div className="col-2"> 
          <div> session.user.username  </div> 
          <button onClick={this.handleLogout}>log out</button> 
          </div>

            <div className="col-10 mb-4">
              <textarea
                value={newTweetContent}
                onChange={this.handleNewTweetChange}
                placeholder="Composez votre tweet..."
              />
              <button onClick={this.handlePostTweet}>Post</button>
            </div>
            <div className="col-10">
              {tweets.map(tweet => {
                return (
                  <div key={tweet.id} className="col-12 mb-4 tweet"> 
                    <a href="#">{tweet.username}</a>                   
                    <p>{tweet.message}</p>
                    <button onClick={() => this.handleDeleteTweet(tweet.id)}>Delete</button>              
                  </div>
                )
              })}
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

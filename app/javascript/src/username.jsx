import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';

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

    fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newTweetContent }),
    })
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

  render () {   
    const { tweets, loading, newTweetContent } = this.state;
    console.log(tweets);
    return (
      <Layout>
        <div className="container pt-4">
          <div className="row align-items-start">
            <div className="col-12 mb-4">
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

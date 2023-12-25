// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import {safeCredentials, handleErrors } from '@utils/fetchHelper';

import './home.scss';

class Home extends React.Component {
  state = {
    tweets: [],
    loading: true,
    newTweetContent:""
  }

  componentDidMount() {
    fetch('/api/tweets')
      .then(handleErrors)
      .then(data => {
        console.log(data);

        this.setState({
          tweets: data.tweets,
          loading: false,
        })
      })

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


  render () {   
    const { tweets,  loading, newTweetContent } = this.state;
    console.log(tweets);
    return (
      <Layout>
        <div className="container pt-4">
          <div className="row align-items-start">        
            <div className="col-2"> 
            <div> {this.state.username} </div>    
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
 
           <div className="col-10">
            {tweets.map(tweet => {
              return (
                <div key={tweet.id} className="col-12 mb-4 tweet"> 
                  <a href={tweet.username}>{tweet.username}</a>                 
                  <p>{tweet.message}</p>                  
                </div>
              )
            })} </div>

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
    <Home />,
    document.body.appendChild(document.createElement('div')),
  )
})

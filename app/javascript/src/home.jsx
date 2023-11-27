// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';

import './home.scss';

class Home extends React.Component {
  state = {
    tweets: [],
    loading: true,
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
  }

  render () {   
    const { tweets,  loading } = this.state;
    console.log(tweets);
    return (
      <Layout>
        <div className="container pt-4">
          <div className="row">
            {tweets.map(tweet => {
              return (
                <div key={tweet.id} className="col-6 col-lg-4 mb-4 tweet">                    
                  <p>{tweet.message}</p>                  
                </div>
              )
            })}
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

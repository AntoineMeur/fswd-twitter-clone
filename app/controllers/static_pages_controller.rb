class StaticPagesController < ApplicationController
  def home
    # check if user is logged in via session token
    token = cookies.permanent.signed[:twitter_session_token]
    session = Session.find_by(token: token)
    if session
      render 'home'
    else # if not, redirect to login page
      redirect_to '/login'
    end
  end

  def login
    render 'login'
  end
end

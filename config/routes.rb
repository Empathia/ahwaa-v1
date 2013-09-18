require 'resque/server'

Lgbt::Application.routes.draw do
  Resque::Server.use Rack::Auth::Basic do |username, password|
    password == 'ahwaa477!' && username == 'admin'
  end
  mount Resque::Server.new, :at => "/resque"

  resources :subscriptions, :only => [] do
    get 'unsubscribe', :on => :member
    get 'unsubscribe_author', :on => :member
  end

  get "search/topics"
  post "avatars/matches"

  get "login" => "sessions#new"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy"

  resources :topic_requests, :only => [:new, :create]
  resources :blocks, :only => [:create, :destroy] do
    post :unblock, :on => :collection
  end
  resource :user, :path => "myprofile", :only => [:show, :destroy, :edit, :update] do
    get "inbox"

  end
  resources :users, :except => [:show, :destroy, :update, :edit] do
    collection do
        get :card
    end
    resource :private_messages, :only => [:create]
  end

  resources :passwords, :only => [:create, :edit, :update]

  resources :private_messages, :path => "inbox", :except => [:new, :edit, :update, :create] do
    member do
      post :reply
    end
  end

  resources :bad_words, :only => [:index]

  resources :topics, :only => [:show] do
    collection do
        get :related_content
    end
    resources :replies, :only => [:create] do
      member do
        post :flag
        post :vote_up
      end
    end

    post :follow, :on => :member
    post :unfollow, :on => :member
  end

  get '/tag/:tag' => "topics#tag", :as => :topic_tag
  get '/profile/:user_id' => "users#profile", :as => :profile
  post "/notifications" => "notifications#create"
  get '/stream' => "home#stream", :as => :stream
  get '/my_topics' => 'home#my_topics', :as => :my_topics

  root :to => "home#index"

  namespace :admin do

    resources :tags, :only => [:index, :destroy] do
      post 'sort', :on => :collection
    end
    resources :flagged_replies, :only => [:index, :destroy] do
      put 'unflag', :on => :member
      post 'bulk_update', :on => :collection
    end
    resource  :bad_words, :only => [:show, :update]
    resources :topic_requests, :only => [:index, :destroy]
    resources :topics, :except => [:show] do
      resources :profile_matches, :only => [:index] do
        collection do
          post :list_matches
        end
        member do
          post :notify
        end
      end
    end
    resources :featured_topics, :only => [:index] do
      member do
        post :toggle
      end
    end
    resources :users, :only => [:index, :destroy, :edit, :update] do
      member do
        put :toggle_expert
        put :toggle_mod
      end
      collection do
        get :search_users
      end
    end
    root :to => 'topics#index'
  end

  get "privacy_policy" => "home#privacy_policy"
  get "about" => "home#about"
  get "terms" => "home#terms"

end

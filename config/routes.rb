Lgbt::Application.routes.draw do
  get "search/topics"

  get "login" => "sessions#new"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy"

  resources :topic_requests, :only => [:new, :create]

  resource :user, :path => "profile", :only => [:show, :destroy, :edit, :update]
  resources :users, :except => [:show, :destroy, :update, :edit] do
    resource :private_messages, :only => [:create]
  end

  resources :passwords, :only => [:create, :edit, :update]

  resources :private_messages, :path => "inbox", :except => [:new, :edit, :update, :create]

  resources :bad_words, :only => [:index]

  resources :topics, :only => [:show] do
    resources :replies, :only => [:create] do
      post :flag, :as => :member
      post :vote_up, :as => :member
    end
  end

  get '/tag/:tag' => "topics#tag", :as => :topic_tag

  namespace :admin do
    resources :flagged_replies, :only => [:index, :destroy]
    resource  :bad_words, :only => [:show, :update]
    resources :topic_requests, :only => [:index, :destroy] do
      member do
        delete :promote_to_topic
      end
    end
    resources :topics, :except => [:show] do
      resources :related_contents, :only => [:destroy, :show, :index, :create]
    end
    resources :users, :only => [:index, :destroy, :edit, :update] do
      member do
        put :toggle_expert
      end
    end
    root :to => 'topics#index'
  end

  root :to => "home#index"
end

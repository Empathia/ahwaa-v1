Lgbt::Application.routes.draw do
  get "search/topics"
  post "avatars/matches"

  get "login" => "sessions#new"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy"

  resources :topic_requests, :only => [:new, :create]

  resource :user, :path => "profile", :only => [:show, :destroy, :edit, :update]
  resources :users, :except => [:show, :destroy, :update, :edit] do
    resource :private_messages, :only => [:create]
  end

  resources :passwords, :only => [:create, :edit, :update]

  resources :private_messages, :path => "inbox", :except => [:new, :edit, :update, :create] do
    member do
      post :reply
    end
  end


  resources :bad_words, :only => [:index]

  # scope '(:locale)', :locale => /en|ar/ do
    resources :topics, :only => [:show] do
      resources :replies, :only => [:create] do
        member do
          post :flag
          post :vote_up
        end
      end
    end

    get '/tag/:tag' => "topics#tag", :as => :topic_tag

    root :to => "home#index"
  # end

  namespace :admin do
    resources :tags,  :only => [:index, :destroy]
    resources :flagged_replies, :only => [:index, :destroy] do
      put 'unflag', :on => :member
    end
    resource  :bad_words, :only => [:show, :update]
    resources :topic_requests, :only => [:index, :destroy] do
    end
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
    resources :users, :only => [:index, :destroy, :edit, :update] do
      member do
        put :toggle_expert
      end
    end
    root :to => 'topics#index'
  end

  get "privacy_policy" => "home#privacy_policy"
  get "about" => "home#about"
  get "terms" => "home#terms"

end

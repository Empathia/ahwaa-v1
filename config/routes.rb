Lgbt::Application.routes.draw do
  get "login" => "sessions#new"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy"

  resource :user, :path => "profile", :only => [:show, :destroy, :edit, :update]
  resources :users, :except => [:show, :destroy, :update, :edit] do
    resource :private_messages, :only => [:create]
  end

  resources :private_messages, :path => "inbox", :except => [:new, :edit, :update, :create]

  resources :topics, :only => [:show] do
    resources :replies, :only => [:create]
  end

  namespace :admin do
    resource :bad_words, :only => [:show, :update]
    resources :topics, :except => [:show]
    resources :users, :only => [:index, :destroy, :edit, :update] do
      member do
        put :toggle_expert
      end
    end
    root :to => 'topics#index'
  end

  root :to => "home#index"
end

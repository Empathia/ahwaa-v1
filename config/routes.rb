Lgbt::Application.routes.draw do
  devise_for :users

  resource :user, :path => "profile", :only => [:show, :destroy, :update]
  
  resources :users, :only => [] do
    resource :private_messages, :only => [:create]
  end

  resources :private_messages, :path => "inbox", :except => [:new, :edit, :update, :create]

  resources :topics, :only => [:show] do
    resources :replies, :only => [:create]
  end
  
  namespace :admin do
    resources :topics, :except => [:show]

    resources :users, :only => [:index, :destroy, :edit, :update] do
      member do
        put :toggle_expert
      end
    end
    root :to => 'users#index'
  end
  
  root :to => "home#index"
end

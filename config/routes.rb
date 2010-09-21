Lgbt::Application.routes.draw do
  
  devise_for :users
  
  namespace :admin do
    resources :users, :only => :index do
      member do
        put :toggle_expert
      end
    end
    root :to => 'users#index'
  end
  
  root :to => "home#index"
end

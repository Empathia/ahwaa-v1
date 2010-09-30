Lgbt::Application.routes.draw do
  devise_for :users

  resource :user, :path => "/profile", :only => [:show, :destroy, :update]

  namespace :admin do
    resources :users, :only => [:index, :destroy, :edit, :update] do
      member do
        put :toggle_expert
      end
    end
    root :to => 'users#index'
  end

  root :to => "home#index"
  get 'topic' => 'home#topic'
end

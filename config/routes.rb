Lgbt::Application.routes.draw do
  controller :user_sessions do
    get "login", :to => :new
    get "logout", :to => :destroy
    post "login", :to => :create
  end

  root :to => "home#index"
end

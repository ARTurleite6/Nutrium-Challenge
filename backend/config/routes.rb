# frozen_string_literal: true

Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  get '/locales', to: 'application#locales'
  resources :nutritionist_services, as: :nutritionists, only: :index

  resources :appointments, only: :create do
    patch :accept
    patch :reject
  end

  resources :nutritionists, only: [] do
    member do
      get :appointments
    end
  end
end

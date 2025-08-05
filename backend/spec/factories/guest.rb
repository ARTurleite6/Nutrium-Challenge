# frozen_string_literal: true

FactoryBot.define do
  factory :guest do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
  end
end

# frozen_string_literal: true

FactoryBot.define do
  factory :nutritionist do
    name { Faker::Name.name }
    license_number { "#{Faker::Number.between(from: 1000, to: 9999)}N" }
    title { Faker::Job.title }
  end
end

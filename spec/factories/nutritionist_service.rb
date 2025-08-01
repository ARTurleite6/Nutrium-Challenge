FactoryBot.define do
  factory :nutritionist_service do
    association :nutritionist
    association :service
    association :location

    pricing { Faker::Commerce.price(range: 30.0..150.0) }
  end
end

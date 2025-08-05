FactoryBot.define do
  factory :location do
    full_address { Faker::Address.full_address }
    city { Faker::Address.city }
    coordinates { [ Faker::Address.longitude, Faker::Address.latitude ] }
  end
end

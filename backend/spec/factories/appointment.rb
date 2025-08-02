FactoryBot.define do
  factory :appointment do
    association :guest
    association :nutritionist_service
    state { :pending }
    event_date { 1.week.from_now }
  end
end

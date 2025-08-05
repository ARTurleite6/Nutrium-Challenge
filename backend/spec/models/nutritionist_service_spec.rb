# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NutritionistService, type: :model do
  subject { build(:nutritionist_service) }

  describe 'associations' do
    it { should belong_to(:nutritionist) }
    it { should belong_to(:service) }
    it { should belong_to(:location) }
    it { should have_many(:appointments).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:pricing) }
    it { should validate_presence_of(:delivery_method) }
    it { should validate_numericality_of(:pricing).is_greater_than(0) }
    it {
      should validate_uniqueness_of(:nutritionist_id)
        .case_insensitive.scoped_to(%i[service_id location_id delivery_method])
    }
  end
end

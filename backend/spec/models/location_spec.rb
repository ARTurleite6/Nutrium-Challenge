# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Location, type: :model do
  describe 'associations' do
    it { should have_many(:nutritionist_services).dependent(:destroy) }
    it { should have_many(:nutritionists).through(:nutritionist_services) }
  end

  describe 'validations' do
    it { should validate_presence_of(:full_address) }
    it { should validate_presence_of(:city) }
    it { should validate_presence_of(:coordinates) }
  end
end

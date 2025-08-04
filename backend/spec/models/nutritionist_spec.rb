# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Nutritionist, type: :model do
  subject { build(:nutritionist) }

  describe 'associations' do
    it { should have_many(:nutritionist_services).dependent(:destroy) }
    it { should have_many(:services).through(:nutritionist_services) }
    it { should have_many(:appointments).through(:nutritionist_services) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:license_number) }
    it { should validate_uniqueness_of(:license_number) }
  end
end

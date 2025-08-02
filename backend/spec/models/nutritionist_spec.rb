require 'rails_helper'

RSpec.describe Nutritionist, type: :model do
  describe 'associations' do
    it { should have_many(:nutritionist_services).dependent(:destroy) }
    it { should have_many(:services).through(:nutritionist_services) }
    it { should have_many(:appointments).through(:nutritionist_services) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
  end
end

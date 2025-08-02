require 'rails_helper'

RSpec.describe Guest, type: :model do
  subject { build(:guest) }

  describe 'associations' do
    it { should have_many(:appointments).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
  end
end

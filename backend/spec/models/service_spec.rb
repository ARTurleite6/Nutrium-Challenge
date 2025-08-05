# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Service, type: :model do
  describe 'associations' do
    it { should have_many(:nutritionist_services).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
  end
end

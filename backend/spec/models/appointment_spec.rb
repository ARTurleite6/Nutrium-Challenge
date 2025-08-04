# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Appointment, type: :model do
  subject { build_stubbed(:appointment) }

  describe 'associations' do
    it { should belong_to(:guest) }
    it { should belong_to(:nutritionist_service) }
  end

  describe 'validations' do
    it { should validate_presence_of(:event_date) }
    it { should define_enum_for(:state).with_values(pending: 0, accepted: 1, rejected: 2) }

    describe 'future appointment validation' do
      it 'is valid when appointment is in the future' do
        appointment = build(:appointment, event_date: 1.day.from_now)
        expect(appointment).to be_valid
      end

      it 'is invalid when appointment is in the past' do
        appointment = build(:appointment, event_date: 1.day.ago)
        expect(appointment).not_to be_valid
        expect(appointment.errors[:event_date]).to include('must be in the future')
      end
    end
  end

end

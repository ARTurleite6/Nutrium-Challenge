# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CreateAppointmentService do
  include ActiveJob::TestHelper

  let(:nutritionist) { create(:nutritionist) }
  let(:service) { create(:service) }
  let(:location) { create(:location) }
  let(:nutritionist_service) do
    create(:nutritionist_service,
           nutritionist: nutritionist,
           service: service,
           location: location)
  end
  let(:future_date) { 2.days.from_now }

  let(:valid_params) do
    {
      guest_attributes: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      nutritionist_service_id: nutritionist_service.id,
      event_date: future_date
    }
  end

  subject(:service_instance) { described_class.new(valid_params) }

  describe '#perform' do
    context 'with valid parameters' do
      it 'returns a successful result' do
        result = service_instance.perform

        expect(result.success?).to be(true)
        expect(result.appointment).to be_a(Appointment)
        expect(result.errors).to be_nil
      end

      it 'creates a new appointment' do
        expect do
          service_instance.perform
        end.to change { Appointment.count }.by(1)
      end

      it 'creates appointment with correct attributes' do
        result = service_instance.perform
        appointment = result.appointment

        expect(appointment.nutritionist_service).to eq(nutritionist_service)
        expect(appointment.event_date.to_i).to eq(future_date.to_i)
        expect(appointment.state).to eq('pending')
      end

      it 'creates a new guest when guest does not exist' do
        expect do
          service_instance.perform
        end.to change { Guest.count }.by(1)
      end

      it 'creates guest with correct attributes' do
        result = service_instance.perform
        guest = result.appointment.guest

        expect(guest.name).to eq('John Doe')
        expect(guest.email).to eq('john@example.com')
      end
    end

    context 'when guest already has an appointment' do
      let(:existing_guest) { create(:guest, name: 'John Doe', email: 'john@example.com') }
      let!(:existing_appointment) { create(:appointment, guest: existing_guest) }
      let(:create_appointment) { service_instance.perform }

      it 'creates a new appointment and rejects all pending appointments' do
        aggregate_failures do
          expect do
            create_appointment
          end.to change { Appointment.count }.by(1)

          expect(create_appointment.success?).to be(true)
          expect(existing_appointment.reload.state).to eq('rejected')
        end
      end
    end

    context 'when guest already has a pending appointment and gives different name' do
      let(:existing_guest) { create(:guest, name: 'Cenas', email: 'john@example.com') }
      let!(:existing_appointment) { create(:appointment, guest: existing_guest, state: :pending) }
      let(:create_appointment) { service_instance.perform }

      it 'creates a new appointment and rejects the pending appointment' do
        aggregate_failures do
          expect do
            create_appointment
          end.to change { Appointment.count }.by(1)

          expect(create_appointment.success?).to be(true)
          expect(existing_guest.reload.name).to eq('John Doe')
        end
      end
    end

    context 'with invalid nutritionist_service_id' do
      let(:invalid_params) do
        valid_params.merge(nutritionist_service_id: 'non-existent-id')
      end
      let(:service_with_invalid_params) { described_class.new(invalid_params) }

      it 'raises ActiveRecord::RecordNotFound' do
        expect do
          service_with_invalid_params.perform
        end.not_to(change { Appointment.count })
      end
    end

    context 'with invalid appointment parameters' do
      let(:invalid_params) do
        valid_params.merge(event_date: 1.day.ago) # Past date
      end
      let(:result) { described_class.new(invalid_params).perform }

      it 'returns the error messages' do
        aggregate_failures do
          expect do
            result
          end.not_to(change { Appointment.count })
          expect(result.success?).to be(false)
          expect(result.errors).to include(:appointment)
          expect(result.errors[:appointment].full_messages).to include('Event date must be in the future')
        end
      end
    end

    context 'with invalid guest parameters' do
      let(:invalid_params) do
        valid_params.merge(guest_attributes: { email: 'invalid-email' })
      end
      let(:result) { described_class.new(invalid_params).perform }

      it 'returns the error messages' do
        aggregate_failures do
          expect do
            result
          end.not_to(change { Appointment.count })
          expect(result.success?).to be(false)
          expect(result.errors).to include(:guest)
          expect(result.errors[:guest].full_messages).to include("Name can't be blank", 'Email is invalid')
        end
      end
    end
  end
end

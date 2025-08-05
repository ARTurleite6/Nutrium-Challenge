# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Appointments', type: :request do
  let(:json) { JSON.parse(response.body) }
  let!(:nutritionist_service) { create(:nutritionist_service) }

  describe 'POST /appointments' do
    let(:valid_params) do
      {
        appointment: {
          guest_attributes: {
            name: 'João Silva',
            email: 'joao@example.com'
          },
          nutritionist_service_id: nutritionist_service.id,
          event_date: 1.week.from_now.iso8601
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new appointment' do
        aggregate_failures do
          expect do
            post appointments_path, params: valid_params, as: :json
          end.to change(Appointment, :count).by(1)
          expect(response).to have_http_status(:created)
          expect(json).to include(
            'id',
            'guest',
            'nutritionist_service',
            'event_date'
          )
        end
      end

      it 'creates a new guest when guest does not exist' do
        expect do
          post appointments_path, params: valid_params, as: :json
        end.to change(Guest, :count).by(1)

        created_guest = Guest.last
        expect(created_guest.name).to eq('João Silva')
        expect(created_guest.email).to eq('joao@example.com')
      end
    end

    context 'when guest already exists with same name' do
      let!(:existing_guest) { create(:guest, name: 'João Silva', email: 'joao@example.com') }

      it 'uses the existing guest' do
        expect do
          post appointments_path, params: valid_params, as: :json
        end.not_to change(Guest, :count)

        appointment = Appointment.last
        expect(appointment.guest).to eq(existing_guest)
      end

      it 'does not update the guest name' do
        original_name = existing_guest.name
        post appointments_path, params: valid_params, as: :json

        expect(existing_guest.reload.name).to eq(original_name)
      end
    end

    context 'when guest exists with different name' do
      let!(:existing_guest) { create(:guest, name: 'João', email: 'joao@example.com') }
      let(:params_with_different_name) do
        valid_params.tap do |p|
          p[:appointment][:guest_attributes][:name] = 'Dr. João Silva'
        end
      end

      it 'updates the guest name' do
        post appointments_path, params: params_with_different_name, as: :json

        expect(existing_guest.reload.name).to eq('Dr. João Silva')
      end

      it 'creates appointment with the existing guest' do
        expect do
          post appointments_path, params: params_with_different_name, as: :json
        end.not_to change(Guest, :count)

        appointment = Appointment.last
        expect(appointment.guest).to eq(existing_guest)
      end

      it 'returns success response' do
        post appointments_path, params: params_with_different_name, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid nutritionist_service_id' do
      let(:invalid_params) do
        valid_params.tap do |p|
          p[:appointment][:nutritionist_service_id] = 'non-existent-id'
        end
      end

      it 'returns unprocessable entity status' do
        post appointments_path, params: invalid_params, as: :json

        aggregate_failures do
          expect(response).to have_http_status(:unprocessable_content)
          expect(json['errors']).to include('appointment')
          expect(json['errors']['appointment']).to eq({
                                                        'nutritionist_service' => ['must exist']
                                                      })
        end
      end

      it 'returns error messages' do
        post appointments_path, params: invalid_params, as: :json
      end

      it 'does not create an appointment' do
        expect do
          post appointments_path, params: invalid_params, as: :json
        end.not_to change(Appointment, :count)
      end
    end

    context 'with missing required parameters' do
      let(:missing_guest_name) do
        {
          appointment: {
            guest_attributes: {
              email: 'test@example.com'
            },
            nutritionist_service_id: nutritionist_service.id,
            event_date: 1.week.from_now.iso8601
          }
        }
      end

      it 'handles missing guest_name parameter' do
        post appointments_path, params: missing_guest_name, as: :json

        aggregate_failures do
          expect(response).to have_http_status(:unprocessable_content)
          expect(json['errors']).to include('guest')
          expect(json['errors']).to eq({
                                         'guest' => { 'name' => ['can\'t be blank'] }
                                       })
        end
      end
    end

    context 'with invalid guest email format' do
      let(:invalid_email_params) do
        valid_params.tap do |p|
          p[:appointment][:guest_attributes][:email] = 'invalid-email'
        end
      end

      it 'returns unprocessable entity status' do
        post appointments_path, params: invalid_email_params, as: :json

        aggregate_failures do
          expect(response).to have_http_status(:unprocessable_content)
          expect(json['errors']).to include('guest')
          expect(json['errors']).to eq({
                                         'guest' => { 'email' => ['is invalid'] }
                                       })
        end
      end
    end
  end
end

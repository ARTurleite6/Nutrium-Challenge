require 'rails_helper'

RSpec.describe AcceptAppointmentService do
  include ActiveJob::TestHelper

  let(:guest) { create(:guest) }
  let(:nutritionist) { create(:nutritionist) }
  let(:service) { create(:service) }
  let(:location) { create(:location) }
  let(:nutritionist_service) do
    create(:nutritionist_service,
           nutritionist: nutritionist,
           service: service,
           location: location)
  end
  let(:appointment) do
    create(:appointment,
           guest: guest,
           nutritionist_service: nutritionist_service,
           state: :pending,
           event_date: 2.days.from_now)
  end

  subject(:service_instance) { described_class.new(appointment) }

  describe '#perform' do
    context 'when appointment is valid and pending' do
      it 'returns a successfull result' do
        result = service_instance.perform

        aggregate_failures do
          expect(result.success?).to be(true)
          expect(result.appointment).to eq(appointment)
          expect(result.errors).to be_nil
        end
      end

      it 'updates appointment state to accepted' do
        expect {
          service_instance.perform
        }.to change { appointment.reload.state }.from('pending').to('accepted')
      end

      it 'enqueues notification job' do
        expect {
          service_instance.perform
        }.to have_enqueued_job(AppointmentNotificationJob)
          .with(appointment.id, 'accepted')
          .on_queue('email_notifications')
      end

      it 'returns the appointment in the result' do
        result = service_instance.perform

        aggregate_failures do
          expect(result.appointment).to eq(appointment)
          expect(result.appointment.state).to eq('accepted')
        end
      end
    end
  end
end

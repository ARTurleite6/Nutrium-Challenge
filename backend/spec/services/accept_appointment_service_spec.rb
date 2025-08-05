# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AcceptAppointmentService do
  include ActiveJob::TestHelper
  let(:accept_appointment) { described_class.new(appointment).perform }

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

  describe '#perform' do
    context 'when appointment is valid and pending' do
      it 'returns a successfull result' do
        aggregate_failures do
          expect(accept_appointment.success?).to be(true)
          expect(accept_appointment.appointment).to eq(appointment)
          expect(accept_appointment.errors).to be_nil
        end
      end

      it 'updates appointment state to accepted' do
        expect do
          accept_appointment
        end.to change { appointment.reload.state }.from('pending').to('accepted')
      end

      it 'enqueues notification job' do
        expect do
          accept_appointment
        end.to have_enqueued_job(AppointmentNotificationJob)
          .with(appointment.id, 'accepted')
          .on_queue('email_notifications')
      end

      it 'returns the appointment in the result' do
        aggregate_failures do
          expect(accept_appointment.appointment).to eq(appointment)
          expect(accept_appointment.appointment.state).to eq('accepted')
        end
      end
    end

    context 'when nutritionist already has an pending appointment at the same time' do
      let!(:pending_appointment) do
        create(:appointment,
               guest: guest,
               nutritionist_service: nutritionist_service,
               state: :pending,
               event_date: appointment.event_date)
      end
      let!(:pending_appointment2) do
        create(:appointment,
               guest: guest,
               nutritionist_service: nutritionist_service,
               state: :pending,
               event_date: appointment.event_date)
      end

      it 'sets every nutritionist appointments at the same time to rejected' do
        aggregate_failures do
          expect { accept_appointment }.to have_enqueued_job(AppointmentNotificationJob)
            .with(pending_appointment.id, 'rejected')
            .on_queue('email_notifications')
            .and have_enqueued_job(AppointmentNotificationJob)
            .with(pending_appointment2.id, 'rejected')
            .on_queue('email_notifications')

          expect(pending_appointment.reload.state).to eq('rejected')
          expect(pending_appointment2.reload.state).to eq('rejected')
        end
      end
    end
  end
end

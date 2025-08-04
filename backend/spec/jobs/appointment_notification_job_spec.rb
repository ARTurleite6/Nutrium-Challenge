# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AppointmentNotificationJob, type: :job do
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
           state: :pending)
  end

  describe '#perform' do
    context 'when action is "accepted"' do
      before { appointment.update!(state: :accepted) }

      it 'sends appointment accepted email' do
        expect do
          described_class.perform_now(appointment.id, 'accepted')
        end.to change { ActionMailer::Base.deliveries.count }.by(1)

        email = ActionMailer::Base.deliveries.last
        expect(email.to).to include(guest.email)
        expect(email.subject).to include('accepted')
      end
    end

    context 'when action is "rejected"' do
      before { appointment.update!(state: :rejected) }

      it 'sends appointment rejected email' do
        expect do
          described_class.perform_now(appointment.id, 'rejected')
        end.to change { ActionMailer::Base.deliveries.count }.by(1)

        email = ActionMailer::Base.deliveries.last
        expect(email.to).to include(guest.email)
        expect(email.subject).to match(/request|declined/i)
      end
    end
  end
end

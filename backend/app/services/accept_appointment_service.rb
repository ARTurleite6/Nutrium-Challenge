# frozen_string_literal: true

class AcceptAppointmentService
  Result = Struct.new(:success?, :appointment, :errors, keyword_init: true)

  def initialize(appointment)
    @appointment = appointment
  end

  def perform
    ActiveRecord::Base.transaction do
      appointment.update!(state: :accepted)
      AppointmentNotificationJob.perform_later(appointment.id, 'accepted')

      Appointment
        .for_nutritionist(appointment.nutritionist_service.nutritionist_id)
        .where(state: :pending, event_date: appointment.event_date)
        .where
        .not(id: appointment.id)
        .update!(state: :rejected).each do |app|
          AppointmentNotificationJob.perform_later(app.id, 'rejected')
        end

      Result.new({ success?: true, appointment: })
    end
  rescue ActiveRecord::RecordInvalid => e
    Result.new({ success?: false, errors: e.record&.errors&.full_messages })
  end

  private

  attr_reader :appointment
end

# frozen_string_literal: true

class AcceptAppointmentService
  Result = Struct.new(:success?, :appointment, :errors, keyword_init: true)

  def initialize(appointment)
    @appointment = appointment
  end

  def perform
    appointment.update!(state: :accepted)
    AppointmentNotificationJob.perform_later(appointment.id, 'accepted')
    Result.new({ success?: true, appointment: })
  rescue ActiveRecord::RecordNotFound => e
    Result.new({ success?: false, errors: e.record&.errors&.full_messages })
  end

  private

  attr_reader :appointment
end

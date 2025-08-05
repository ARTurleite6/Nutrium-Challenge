# frozen_string_literal: true

class CreateAppointmentService
  Result = Struct.new(:success?, :appointment, :errors, keyword_init: true)

  def initialize(appointment_params)
    @appointment_params = appointment_params
  end

  def perform
    appointment = Appointment.create!(appointment_params)

    AppointmentNotificationJob.perform_later(appointment.id, 'confirmation')
    Result.new({ success?: true, appointment: })
  rescue ActiveRecord::RecordInvalid => e
    Result.new({ success?: false, errors: e.record&.errors })
  end

  private

  attr_reader :appointment_params
end

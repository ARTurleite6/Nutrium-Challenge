class AppointmentNotificationJob < ApplicationJob
  queue_as :email_notifications

  def perform(appointment_id, action)
    appointment = Appointment.find(appointment_id)

    case action.to_s
    when "accepted"
      # send email
      AppointmentMailer.appointment_accepted(appointment).deliver_now
    when "rejected"
      AppointmentMailer.appointment_rejected(appointment).deliver_now
      # send email
    else
      raise ArgumentError, "Unknown action: #{action}"
    end

    Rails.logger.info "Email notification sent for appointment #{appointment_id} (#{action})"
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Appointment not found: #{appointment_id}"
    # Don't retry for missing records
    nil
  rescue => e
    Rails.logger.error "Failed to send email for appointment #{appointment_id}: #{e.message}"
    raise e
  end
end

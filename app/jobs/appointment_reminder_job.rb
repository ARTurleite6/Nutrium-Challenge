class AppointmentReminderJob < ApplicationJob
  queue_as :reminders

  def perform(appointment_id)
    appointment = Appointment.find(appointment_id)

    return unless appointment.
  end
end

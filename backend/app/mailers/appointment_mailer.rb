# frozen_string_literal: true

class AppointmentMailer < ApplicationMailer
  default from: 'noreply@nutrium.com'

  def appointment_accepted(appointment)
    @appointment = appointment
    @guest = appointment.guest
    @nutritionist = appointment.nutritionist_service.nutritionist
    @service = appointment.nutritionist_service.service
    @location = appointment.nutritionist_service.location

    mail(
      to: @guest.email,
      subject: "✅ Your appointment with #{@nutritionist.name} has been accepted"
    )
  end

  def appointment_rejected(appointment)
    @appointment = appointment
    @guest = appointment.guest
    @nutritionist = appointment.nutritionist_service.nutritionist
    @service = appointment.nutritionist_service.service

    mail(
      to: @guest.email,
      subject: "📅 Your appointment request with #{@nutritionist.name}"
    )
  end

  def appointment_confirmation(appointment)
    @appointment = appointment
    @guest = appointment.guest
    @nutritionist = appointment.nutritionist_service.nutritionist
    @service = appointment.nutritionist_service.service
    @location = appointment.nutritionist_service.location

    mail(
      to: @guest.email,
      subject: "🔔 Appointment Confirmation - #{@service.name} with #{@nutritionist.name}"
    )
  end
end

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
      subject: I18n.t('emails.appointment_mailer.appointment_accepted.subject', nutritionist_name: @nutritionist.name)
    )
  end

  def appointment_rejected(appointment)
    @appointment = appointment
    @guest = appointment.guest
    @nutritionist = appointment.nutritionist_service.nutritionist
    @service = appointment.nutritionist_service.service

    mail(
      to: @guest.email,
      subject: I18n.t('emails.appointment_mailer.appointment_rejected.subject', nutritionist_name: @nutritionist.name)
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
      subject: I18n.t('emails.appointment_mailer.appointment_confirmation.subject',
                      service_name: @service.name,
                      nutritionist_name: @nutritionist.name)
    )
  end
end

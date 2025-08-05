# frozen_string_literal: true

# backend/app/services/create_appointment_service.rb
class CreateAppointmentService
  Result = Struct.new(:success?, :appointment, :errors, keyword_init: true)

  def initialize(appointment_params)
    @appointment_params = appointment_params
  end

  def perform
    ActiveRecord::Base.transaction do
      guest_attributes = appointment_params.delete(:guest_attributes)

      # Find or create the guest by email
      guest = if guest_attributes.present? && guest_attributes[:email].present?
                Guest.find_or_initialize_by(email: guest_attributes[:email])
              else
                Guest.new
              end

      guest.assign_attributes(guest_attributes) if guest_attributes.present?
      guest.save!

      appointment = Appointment.create!(appointment_params.merge(guest: guest))
      AppointmentNotificationJob.perform_later(appointment.id, 'confirmation')
      Appointment.where(guest: appointment.guest).where.not(id: appointment.id).update!(state: :rejected)
      Result.new({ success?: true, appointment: appointment })
    end
  rescue ActiveRecord::RecordInvalid => e
    error_source = case e.record
                   when Guest
                     :guest
                   when Appointment
                     :appointment
                   else
                     :unknown
                   end
    Result.new({ success?: false, errors: { error_source => e.record&.errors } })
  end

  private

  attr_reader :appointment_params
end

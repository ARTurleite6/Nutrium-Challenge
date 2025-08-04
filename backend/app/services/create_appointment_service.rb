# backend/app/services/create_appointment_service.rb
class CreateAppointmentService
  Result = Struct.new(:success?, :appointment, :errors, keyword_init: true)

  def initialize(appointment_params)
    @appointment_params = appointment_params
  end

  def perform
    guest_attributes = appointment_params.delete(:guest_attributes)

    # Find or create the guest by email
    guest = if guest_attributes.present? && guest_attributes[:email].present?
              Guest.find_or_initialize_by(email: guest_attributes[:email])
            else
              Guest.new
            end

    # Update guest attributes if needed
    guest.assign_attributes(guest_attributes) if guest_attributes.present?

    # Save the guest
    unless guest.save
      return Result.new({ success?: false, errors: guest.errors })
    end

    # Create appointment with the found/created guest
    appointment = Appointment.new(appointment_params.merge(guest: guest))

    if appointment.save
      AppointmentNotificationJob.perform_later(appointment.id, 'confirmation')
      Appointment.where(guest: appointment.guest).where.not(id: appointment.id).update_all(state: :rejected)
      Result.new({ success?: true, appointment: appointment })
    else
      Result.new({ success?: false, errors: appointment.errors })
    end
  rescue ActiveRecord::RecordNotFound => e
    Result.new({ success?: false, errors: e.record&.errors })
  end

  private

  attr_reader :appointment_params
end

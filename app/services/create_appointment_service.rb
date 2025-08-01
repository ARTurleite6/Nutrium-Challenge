class CreateAppointmentService
  Result = Struct.new(:success?, :appointment, :errors, keyword_init: true)

  def initialize(appointment_params)
    @appointment_params = appointment_params
  end

  def perform
    guest = Guest.find_or_create_by!(email: appointment_params[:guest_email]) do |g|
      g.name = appointment_params[:guest_name]
    end

    if guest.persisted? && guest.name != appointment_params[:guest_name]
      guest.update!(name: appointment_params[:guest_name])
    end

    appointment = Appointment.create!(guest:, nutritionist_service_id: appointment_params[:nutritionist_service_id], event_date: appointment_params[:event_date])
    Result.new({ success?: true, appointment: })
  rescue ActiveRecord::RecordNotFound => e
    Result.new({ success?: false, errors: e.record&.errors&.full_messages })
  end

  private

  attr_reader :appointment_params
end

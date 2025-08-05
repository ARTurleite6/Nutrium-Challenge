class AppointmentsController < ApplicationController
  def create
    result = CreateAppointmentService.new(appointment_params).perform
    if result.success?
      render json: {
        appointment: result.appointment
      }, status: :created
    else
      render json: {
        errors: e.record&.errors&.full_messages
      }, status: :unprocessable_content
    end
  end

  private

  def appointment_params
    params.require(:appointment).permit(
      :guest_name,
      :guest_email,
      :nutritionist_service_id,
      :event_date
    )
  end
end

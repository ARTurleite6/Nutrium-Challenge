# frozen_string_literal: true

class AppointmentSerializer < ActiveModel::Serializer
  attributes :id, :state, :event_date, :created_at

  belongs_to :guest, serializer: GuestSerializer
  belongs_to :nutritionist_service, serializer: NutritionistServiceSerializer

  def event_date
    object.event_date&.iso8601
  end

  def created_at
    object.created_at&.iso8601
  end
end

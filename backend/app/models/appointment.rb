# frozen_string_literal: true

class Appointment < ApplicationRecord
  belongs_to :guest
  belongs_to :nutritionist_service

  enum :state, { pending: 0, accepted: 1, rejected: 2 }

  validates :event_date, presence: true
  validate :future_appointment

  scope :for_nutritionist, lambda { |nutritionist_id|
    joins(:nutritionist_service).where(nutritionist_service: { nutritionist_id: nutritionist_id })
  }

  private

  def future_appointment
    errors.add(:event_date, 'must be in the future') if event_date&.past?
  end
end

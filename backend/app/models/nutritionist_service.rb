# frozen_string_literal: true

class NutritionistService < ApplicationRecord
  belongs_to :nutritionist
  belongs_to :service
  belongs_to :location
  has_many :appointments, dependent: :destroy

  enum :delivery_method, { in_person: 0, online: 1 }

  validates :pricing, presence: true, numericality: { greater_than: 0 }
  validates :delivery_method, presence: true
  validates :nutritionist_id, uniqueness: { scope: %i[service_id location_id delivery_method] }

  scope :search_by_nutritionist_or_service, lambda { |query|
    return all if query.blank?

    joins(:nutritionist, :service)
      .where('nutritionists.name ILIKE ? OR services.name ILIKE ?',
             "%#{query}%", "%#{query}%")
      .select('DISTINCT ON (nutritionist_services.id) nutritionist_services.*')
  }

  scope :filter_by_location, lambda { |location_query|
    return all if location_query.blank?

    joins(:location)
      .where('locations.city ILIKE ? OR locations.full_address ILIKE ?',
             "%#{location_query}%", "%#{location_query}%")
  }
end

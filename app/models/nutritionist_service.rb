class NutritionistService < ApplicationRecord
  belongs_to :nutritionist
  belongs_to :service
  belongs_to :location
  has_many :appointments, dependent: :destroy

  validates :pricing, presence: true, numericality: { greater_than: 0 }
  validates :nutritionist_id, uniqueness: { scope: [ :service_id, :location_id ] }


  scope :search_by_nutritionist_or_service, ->(query) {
    joins(:nutritionist, :service)
      .where("nutritionists.name ILIKE ? OR services.name ILIKE ?",
             "%#{query}%", "%#{query}%")
      .distinct
  }
end

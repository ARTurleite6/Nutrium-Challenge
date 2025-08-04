# frozen_string_literal: true

class Location < ApplicationRecord
  has_many :nutritionist_services, dependent: :destroy
  has_many :nutritionists, through: :nutritionist_services

  validates :full_address, :city, :coordinates, presence: true

  def latitude
    coordinates&.x
  end

  def longitude
    coordinates&.y
  end
end

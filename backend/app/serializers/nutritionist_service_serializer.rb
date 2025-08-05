# frozen_string_literal: true

class NutritionistServiceSerializer < ActiveModel::Serializer
  attributes :id, :pricing, :delivery_method

  belongs_to :nutritionist, serializer: NutritionistSerializer
  belongs_to :service, serializer: ServiceSerializer
  belongs_to :location, serializer: LocationSerializer

  def pricing
    format('%.2f', object.pricing)
  end
end

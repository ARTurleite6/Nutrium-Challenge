# frozen_string_literal: true

class NutritionistServiceSerializer < ApplicationSerializer
  attributes :id, :pricing, :delivery_method, :delivery_method_translated

  belongs_to :service, serializer: ServiceSerializer
  belongs_to :location, serializer: LocationSerializer

  def pricing
    format('%.2f', object.pricing)
  end

  def delivery_method_translated
    translate_enum(object, 'delivery_method', object.delivery_method)
  end
end

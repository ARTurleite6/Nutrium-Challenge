class NutritionistServiceSerializer < ActiveModel::Serializer
  attributes :id, :pricing

  belongs_to :nutritionist, serializer: NutritionistSerializer
  belongs_to :service, serializer: ServiceSerializer
  belongs_to :location, serializer: LocationSerializer
end

# frozen_string_literal: true

class LocationSerializer < ActiveModel::Serializer
  attributes :id, :city, :full_address, :latitude, :longitude
end

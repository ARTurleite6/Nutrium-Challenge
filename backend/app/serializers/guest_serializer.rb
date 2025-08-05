# frozen_string_literal: true

class GuestSerializer < ActiveModel::Serializer
  attributes :id, :name, :email
end

# frozen_string_literal: true

class ApplicationSerializer < ActiveModel::Serializer
  # Translates an enum value using i18n
  #
  # @param record [ActiveRecord::Base] the model instance
  # @param enum_name [Symbol, String] the name of the enum
  # @param value [Symbol, String] the enum value to translate
  #
  # @return [String] the translated enum value
  def translate_enum(record, enum_name, value)
    return '' if value.nil?

    model_name = record.class.name.underscore
    I18n.t("enums.#{model_name}.#{enum_name}.#{value}", default: value.to_s.humanize)
  end

  # Adds a translated version of an enum attribute
  #
  # @param enum_name [Symbol, String] the name of the enum attribute
  # @param options [Hash] options for the translation
  #
  # @return [Hash] the attribute with its translated value
  def self.translated_enum(enum_name, options = {})
    translated_attr = options.fetch(:as, "#{enum_name}_translated")

    define_method(translated_attr) do
      translate_enum(object, enum_name, object.public_send(enum_name))
    end

    attribute translated_attr
  end

  # Returns a localized date/time
  #
  # @param datetime [DateTime, Time] the datetime to format
  # @param format [Symbol, String] the format to use (:default, :short, :long, etc)
  #
  # @return [String] the formatted datetime
  def localize_datetime(datetime, format = :default)
    return nil if datetime.nil?

    I18n.l(datetime, format: format)
  end
end

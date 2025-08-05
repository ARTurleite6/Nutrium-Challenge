# frozen_string_literal: true

# Base service class with built-in internationalization support
# to provide consistent error handling and result structures
class ApplicationService
  attr_reader :errors

  def initialize
    @errors = {}
    @success = false
  end

  def self.call(*args, **kwargs)
    service = new(*args, **kwargs)
    service.call
    service
  end

  def call
    raise NotImplementedError, 'Subclasses must implement #call'
  end

  # Set successful result
  def success(data = {})
    @success = true
    @data = data
    self
  end

  # Set failure result with errors
  def failure(errors = {})
    @success = false
    @errors = format_errors(errors)
    self
  end

  # Check if the service execution was successful
  def success?
    @success
  end

  # Get result data
  def data
    @data || {}
  end

  # Convenience method to get localized error messages
  def t(key, **options)
    I18n.t(key, **options)
  end

  # Helper method to format ActiveModel errors
  def errors_from_model(model)
    return {} unless model&.errors&.any?

    formatted_errors = {}

    model.errors.each do |error|
      attribute = error.attribute.to_s
      formatted_errors[attribute] ||= []
      formatted_errors[attribute] << error.full_message
    end

    formatted_errors
  end

  private

  # Format errors to ensure they're in a consistent structure
  def format_errors(errors)
    case errors
    when Hash
      errors
    when String
      { base: [errors] }
    when Array
      { base: errors }
    when ActiveModel::Errors
      errors_from_model(errors.instance_variable_get(:@base))
    when ActiveRecord::Base
      errors_from_model(errors)
    else
      { base: [errors.to_s] }
    end
  end
end

# frozen_string_literal: true

class ApplicationController < ActionController::API
  before_action :set_locale

  def locales
    render json: { available_locales: I18n.available_locales, current_locale: I18n.locale }
  end

  def set_locale
    I18n.locale = extract_locale || I18n.default_locale
  end

  def extract_locale
    parsed_locale = params[:locale]
    I18n.available_locales.map(&:to_s).include?(parsed_locale) ? parsed_locale : nil
  end
end

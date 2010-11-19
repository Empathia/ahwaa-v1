class Country < ActiveRecord::Base

  def name
    I18n.t("catalogs.country.#{i18n_name}")
  end

  def to_s
    name
  end

end

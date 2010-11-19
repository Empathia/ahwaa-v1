class Religion < ActiveRecord::Base

  def name
    I18n.t("catalogs.religion.#{i18n_name}")
  end

  def to_s
    name
  end

end

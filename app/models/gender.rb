class Gender < ActiveRecord::Base

  def name
    I18n.t("catalogs.gender.#{i18n_name}")
  end

  def to_s
    name
  end
  
end

class SexualOrientation < ActiveRecord::Base

  def name
    I18n.t("catalogs.sexual_orientation.#{i18n_name}")
  end

  def to_s
    name
  end

end

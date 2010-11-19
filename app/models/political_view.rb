class PoliticalView < ActiveRecord::Base

  def name
    I18n.t("catalogs.political_view.#{i18n_name}")
  end

  def to_s
    name
  end
  
end

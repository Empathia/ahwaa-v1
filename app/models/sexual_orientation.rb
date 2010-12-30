class SexualOrientation < ActiveRecord::Base

  def name
    I18n.t("catalogs.sexual_orientation.#{i18n_name}")
  end

  def to_s
    name
  end

  def self.all_with_all_option
    all + [Struct.new(:id, :name).new('all', I18n.t('catalogs.options.all'))]
  end

end

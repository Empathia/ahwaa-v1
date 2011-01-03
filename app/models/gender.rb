class Gender < ActiveRecord::Base

  def name
    I18n.t("catalogs.gender.#{i18n_name}")
  end

  def to_s
    name
  end

  def self.ids_for_male_and_female_entries
    @ids_for_male_and_female_entries ||= self.where(:i18n_name => ['male','female']).select(:id).map(&:id)
  end

  def self.all_with_all_option
    [Struct.new(:id, :name).new('all', I18n.t('catalogs.options.all'))] + all
  end
  
end

class Age < ActiveRecord::Base

  def to_s
    range
  end

  def self.all_with_all_option
    [Struct.new(:id, :range).new('all', I18n.t('catalogs.options.all'))] + all
  end
  
end

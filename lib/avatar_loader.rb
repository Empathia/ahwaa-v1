class AvatarLoader
  def initialize()
    @avatar_path = "#{Rails.root}/public/images/avatars"
    @gender_mappings = {
      "M" => Gender.find_by_i18n_name('male').id,
      "F" => Gender.find_by_i18n_name('female').id
    }
    @age_mappings = {
      "12-16" => Age.find_by_range('12-16').id,
      "17-24" => Age.find_by_range('17-24').id,
      "25-34" => Age.find_by_range('25-34').id,
      "35-50" => Age.find_by_range('35-50').id,
      "51-65" => Age.find_by_range('51-65').id,
      "65p" =>   Age.find_by_range('65+').id
    }
  end

  def load
    Dir.glob(@avatar_path + '/*.png').each do |avatar|
      name = File.basename(avatar)
      url  = "/images/avatars/#{name}"
      age_id = @age_mappings[name.split('_')[0]]
      gender_id = @gender_mappings[name.split('_')[1]]
      avatar_instance = Avatar.find_or_initialize_by_url(url)
      avatar_instance.gender_id = gender_id
      avatar_instance.age_id = age_id
      avatar_instance.save!
    end
  end
end

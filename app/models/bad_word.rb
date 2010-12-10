class BadWord < ActiveRecord::Base
  validates_uniqueness_of :word

  def self.search_and_replace(text)
    regexp_string = "\\b#{bad_word_index.join('\\b|\\b')}\\b"
    regexp = Regexp.new(regexp_string, Regexp::IGNORECASE)
    text.gsub(regexp) {|re| '*' * re.size }
  end

  def self.get_the_bad_word_index
    self.all.map(&:word)
  end

  def self.set_bad_word_index(list)
    word_list = list.split(',').map(&:strip)
    word_list.each do |word|
      find_or_create_by_word(word)
    end
    self.destroy_all( ['word NOT IN (?)', word_list] )
  end

  def self.reload_bad_word_cache
    Rails.cache.write('bad_word_index', get_the_bad_word_index )
  end

  def self.bad_word_index
    if Rails.cache.read('bad_word_index').nil?
      reload_bad_word_cache
    end

    Rails.cache.read('bad_word_index')
  end

  after_save :reload_class_bad_word_cache
  after_destroy :reload_class_bad_word_cache

  def reload_class_bad_word_cache
    self.class.reload_bad_word_cache
  end

end

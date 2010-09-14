# Validates the format of an email with simple regexp
class EmailValidator < ActiveModel::EachValidator
  EMAIL_REGEX = /\A([a-z0-9_\.-]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  
  def validate_each(record, attribute, value)
    record.errors.add(attribute, options[:message] || :invalid) unless value =~ EMAIL_REGEX
  end
end

class UserObserver < ActiveRecord::Observer

  def after_create(user)
    [Level, Badge, Prize].each do |klass|
      user.set_reward klass.first
    end
  end

end

class UserObserver < ActiveRecord::Observer

  def after_create(user)
    Reward.descendants.each do |klass|
      user.set_reward klass.first if klass.first
    end
  end

end

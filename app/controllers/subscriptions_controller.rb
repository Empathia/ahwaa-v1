class SubscriptionsController < ApplicationController
  skip_before_filter :authenticate_user!

  def unsubscribe
    subscription = Subscription.find_by_hash_key(params[:id])
    if subscription
      subscription.destroy
      redirect_to subscription.topic, :notice => t('flash.subscriptions.unsubscribe.notice')
    else
      redirect_to root_path, :alert => t('flash.subscriptions.unsubscribe.alert')
    end
  end

end

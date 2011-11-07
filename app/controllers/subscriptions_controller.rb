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

  def unsubscribe_author
    topic = Topic.find_by_author_subscription(params[:id])
    if topic && topic.unsubscribe_author!
      redirect_to topic, :notice => t('flash.subscriptions.unsubscribe_author.notice')
    else
      redirect_to root_path, :alert => t('flash.subscriptions.unsubscribe_author.alert')
    end
  end

end

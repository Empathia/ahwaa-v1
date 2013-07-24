class TopicRequestsController < ApplicationController

  def new
    @topic_request = TopicRequest.new
    render :layout => false;
  end

  def create
    emoticons(params[:topic_request][:title])
    @topic_request = current_user.topic_requests.new(params[:topic_request])

    if @topic_request.save
      @topic_request.vote!(current_user)
      User.notify_about_topic_request!(@topic_request)
      flash[:notice] = t('flash.topic_requests.create.notice')
    end


    redirect_to stream_path
  end
  def emoticons(text)
    text.gsub!("o:)", "<img src='/images/smileys/angel.gif' border='0' />")
    text.gsub!(":3", "<img src='/images/smileys/colonthree.gif' border='0' />")
    text.gsub!("o.O", "<img src='/images/smileys/confused.gif' border='0' />")
    text.gsub!(":'(", "<img src='/images/smileys/cry.gif' border='0' />")
    text.gsub!("3:)", "<img src='/images/smileys/devil.gif' border='0' />")
    text.gsub!(":(", "<img src='/images/smileys/frown.gif' border='0' />")
    text.gsub!(":O", "<img src='/images/smileys/gasp.gif' border='0' />")
    text.gsub!("8)", "<img src='/images/smileys/glasses.gif' border='0' />")
    text.gsub!(":D", "<img src='/images/smileys/grin.gif' border='0' />")
    text.gsub!(">:(", "<img src='/images/smileys/grumpy.gif' border='0' />")
    text.gsub!("<3", "<img src='/images/smileys/heart.gif' border='0' />")
    text.gsub!("^_^", "<img src='/images/smileys/kiki.gif' border='0' />")
    text.gsub!(":*", "<img src='/images/smileys/kiss.gif' border='0' />")
    text.gsub!(":v", "<img src='/images/smileys/pacman.gif' border='0' />")
    text.gsub!(":)", "<img src='/images/smileys/smile.gif' border='0' />")
    text.gsub!("-_-", "<img src='/images/smileys/squint.gif' border='0' />")
    text.gsub!("8|", "<img src='/images/smileys/sunglasses.gif' border='0' />")
    text.gsub!(":p", "<img src='/images/smileys/tongue.gif' border='0' />")
    text.gsub!(":/", "<img src='/images/smileys/unsure.gif' border='0' />")
    text.gsub!("@:O", "<img src='/images/smileys/upset.gif' border='0' />")
    text.gsub!(";)", "<img src='/images/smileys/wink.gif' border='0' />")
  end
end

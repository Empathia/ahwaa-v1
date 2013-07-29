class RepliesController < ApplicationController
  respond_to :js
  before_filter :find_topic

  def create
    emoticons(params[:reply][:content])
    @reply = @topic.replies.build(params[:reply])
    @reply.parent = @topic.replies.find(params[:reply_to]) unless params[:reply_to].blank?
    @reply.user = current_user
    @reply.save
    respond_to do |format|
      format.html {redirect_to @topic}
      format.js {respond_with(@reply)}
    end
  end

  def flag
    @reply = @topic.all_replies.find(params[:id])
    if @reply
      @flagged = !!@reply.flag!(current_user)
    end
  end

  def vote_up
    @reply = @topic.all_replies.find(params[:id])
    if @reply
      @voted = !!@reply.vote_up!(current_user)
    end
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

  private

    def find_topic
      @topic = Topic.find(params[:topic_id])
    end
end

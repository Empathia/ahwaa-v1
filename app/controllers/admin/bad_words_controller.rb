class Admin::BadWordsController < ApplicationController
  before_filter :authenticate_admin!
  layout 'admin'

  def show
    @bad_words = BadWord.get_the_bad_word_index
    @bad_word_list = @bad_words.join(',')
  end

  def update
    BadWord.set_bad_word_index(params[:bad_word_list])
    redirect_to :action => "show"
  end

end

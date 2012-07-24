module HomeHelper
  def stream_filter_options(user = nil)
    user_topics = if user == current_user
                    t 'stream.filters.my_topics'
                  else
                    t 'stream.filters.user_topics', :username => user.username
                  end
    [
      [t('stream.filters.all'), 'all'],
      [t('stream.filters.featured'), 'featured'],
      [t('stream.filters.followed'), 'followed'],
      [user_topics, 'owned']
    ]
  end
end

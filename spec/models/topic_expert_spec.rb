require 'spec_helper'

describe TopicExpert do
  before(:each) do
    Factory(:topic_expert)
  end

  it { should belong_to(:topic) }
  it { should belong_to(:expert) }
end

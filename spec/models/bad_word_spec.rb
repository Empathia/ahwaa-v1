# coding: utf-8
require 'spec_helper'

describe BadWord do

  describe 'bad word CRUD' do
    before(:each) do
      Factory(:bad_word)
    end

    it { should validate_uniqueness_of(:word) }

    after(:each) do
      Rails.cache.delete('bad_word_index')
    end
  end

  describe 'Bad Word Cache' do
    it "should have an empty word index if no words have been added" do
      BadWord.bad_word_index.should == []
    end

    it "should read the bad word index from cache first time" do
      first_read = BadWord.bad_word_index
      BadWord.bad_word_index.should === first_read
    end

    it "should recreate the cache when a word gets added to the index" do
      BadWord.create!(:word => 'fool')
      BadWord.bad_word_index.should == ['fool']
      BadWord.create!(:word => 'stupid')
      BadWord.bad_word_index.should == ['fool','stupid']
    end

    describe 'set_bad_word_index' do

      it "should set a fresh word index from a comma sepparated list" do
        BadWord.set_bad_word_index('fool, stoopid')

        BadWord.get_the_bad_word_index.should == ['fool', 'stoopid']
      end

    end

    describe 'search_and_replace' do
      before(:each) do
        BadWord.create!(:word => 'fool')
        BadWord.create!(:word => 'stupid')
      end

      it "should replace all leters in a bad word with *" do
        BadWord.search_and_replace('John is stupid and a fOOl').should ==
          'John is ****** and a ****'
      end

      it "should not replace matches that are not exact" do
        BadWord.search_and_replace('John is stupid and fOOlish').should ==
          'John is ****** and fOOlish'
      end

      it 'should work in arabic' do
        BadWord.create!(:word => 'سيئة')
        BadWord.search_and_replace('سيئة').should == '****'
      end
    end

  end
end

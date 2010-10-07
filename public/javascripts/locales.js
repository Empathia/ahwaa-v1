if (!window.I18n) { I18n = {}; }

I18n.defaultLocale = "en";

I18n.translations = {"en":{"flash":{"actions":{"create":{"notice":"%{resource_name} was successfully created."},"update":{"notice":"%{resource_name} was successfully updated."},"destroy":{"alert":"%{resource_name} could not be destroyed.","notice":"%{resource_name} was successfully destroyed."}},"application":{"should_be_admin":"You should have admin credentials to access this part of site."}},"support":{"array":{"two_words_connector":" and ","last_word_connector":", and ","words_connector":", "}},"activemodel":{"attributes":{"reply":{"categories":{"advice":"Advice","experience":"Experience","comment":"Comment"}}}},"datetime":{"distance_in_words":{"about_x_hours":{"other":"about %{count} hours","one":"about 1 hour"},"about_x_years":{"other":"about %{count} years","one":"about 1 year"},"x_days":{"other":"%{count} days","one":"1 day"},"over_x_years":{"other":"over %{count} years","one":"over 1 year"},"less_than_x_minutes":{"other":"less than %{count} minutes","one":"less than a minute"},"about_x_months":{"other":"about %{count} months","one":"about 1 month"},"x_minutes":{"other":"%{count} minutes","one":"1 minute"},"almost_x_years":{"other":"almost %{count} years","one":"almost 1 year"},"x_months":{"other":"%{count} months","one":"1 month"},"less_than_x_seconds":{"other":"less than %{count} seconds","one":"less than 1 second"},"half_a_minute":"half a minute","x_seconds":{"other":"%{count} seconds","one":"1 second"}},"prompts":{"day":"Day","month":"Month","year":"Year","hour":"Hour","second":"Seconds","minute":"Minute"}},"number":{"percentage":{"format":{"delimiter":""}},"currency":{"format":{"unit":"$","significant":false,"format":"%u%n","strip_insignificant_zeros":false,"precision":2,"separator":".","delimiter":","}},"human":{"storage_units":{"format":"%n %u","units":{"gb":"GB","tb":"TB","byte":{"other":"Bytes","one":"Byte"},"kb":"KB","mb":"MB"}},"format":{"significant":true,"strip_insignificant_zeros":true,"precision":3,"delimiter":""},"decimal_units":{"format":"%n %u","units":{"quadrillion":"Quadrillion","unit":"","thousand":"Thousand","million":"Million","billion":"Billion","trillion":"Trillion"}}},"format":{"significant":false,"strip_insignificant_zeros":false,"precision":3,"separator":".","delimiter":","},"precision":{"format":{"delimiter":""}}},"topics":{"show":{"contextual":{"add_comment":"Add Comment"},"icons":{"social":{"linked_in":"Liked In","facebook":"Facebook","twitter":"Twitter"}},"reply_form":{"comment":"Comment"},"related_content":{"arrows":{"next":"Next","back":"Back"},"title":"Related Content"},"sidebar":{"filter_responses":{"title":"Filter responses"},"hide_all_responses":"Hide all responses","filter_helpful":"Show only helpful commentaries","show_all_responses":"Show all responses","need_help":"Need help?","experts":{"title":"Topic experts"},"filter":{"all":"All"}}}},"errors":{"messages":{"inclusion":"is not included in the list","less_than_or_equal_to":"must be less than or equal to %{count}","not_found":"not found","too_long":"is too long (maximum is %{count} characters)","exclusion":"is reserved","not_locked":"was not locked","odd":"must be odd","not_a_number":"is not a number","accepted":"must be accepted","greater_than":"must be greater than %{count}","empty":"can't be empty","invalid":"is invalid","already_confirmed":"was already confirmed","even":"must be even","confirmation":"doesn't match confirmation","blank":"can't be blank","greater_than_or_equal_to":"must be greater than or equal to %{count}","equal_to":"must be equal to %{count}","wrong_length":"is the wrong length (should be %{count} characters)","less_than":"must be less than %{count}","not_an_integer":"must be an integer","too_short":"is too short (minimum is %{count} characters)"},"format":"%{attribute} %{message}"},"devise":{"confirmations":{"send_instructions":"You will receive an email with instructions about how to confirm your account in a few minutes.","confirmed":"Your account was successfully confirmed. You are now signed in."},"passwords":{"send_instructions":"You will receive an email with instructions about how to reset your password in a few minutes.","updated":"Your password was changed successfully. You are now signed in."},"mailer":{"confirmation_instructions":{"subject":"Confirmation instructions"},"reset_password_instructions":{"subject":"Reset password instructions"},"unlock_instructions":{"subject":"Unlock Instructions"}},"sessions":{"signed_out":"Signed out successfully.","signed_in":"Signed in successfully.","new":{"username_or_email":"Username or Email","submit":"Sign in","title":"Sign in"}},"failure":{"unauthenticated":"You need to sign in or sign up before continuing.","invalid":"Invalid email or password.","unconfirmed":"You have to confirm your account before continuing.","inactive":"Your account was not activated yet.","invalid_token":"Invalid authentication token.","timeout":"Your session expired, please sign in again to continue.","locked":"Your account is locked."},"registrations":{"destroyed":"Bye! Your account was successfully cancelled. We hope to see you again soon.","updated":"You updated your account successfully.","signed_up":"You have signed up successfully. If enabled, a confirmation was sent to your e-mail.","new":{"submit":"Create account","title":"Sign up"}},"unlocks":{"send_instructions":"You will receive an email with instructions about how to unlock your account in a few minutes.","unlocked":"Your account was successfully unlocked. You are now signed in."}},"helpers":{"select":{"prompt":"Please select"},"submit":{"update":"Update %{model}","create":"Create %{model}","submit":"Save %{model}"}},"activerecord":{"errors":{"messages":{"record_invalid":"Validation failed: %{errors}","taken":"has already been taken"}}},"time":{"formats":{"default":"%a, %d %b %Y %H:%M:%S %z","long":"%B %d, %Y %H:%M","short":"%d %b %H:%M"},"pm":"pm","am":"am"},"date":{"month_names":[null,"January","February","March","April","May","June","July","August","September","October","November","December"],"formats":{"default":"%Y-%m-%d","long":"%B %d, %Y","short":"%b %d"},"abbr_day_names":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"day_names":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"abbr_month_names":[null,"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"order":["year","month","day"]}}};

(function(){

  var interpolatePattern = /\{\{([^}]+)\}\}/g;

  //Replace {{foo} with obj.foo
  function interpolate(str, obj){
    return str.replace(interpolatePattern, function(){
      return obj[arguments[1]] || arguments[0];
    });
  };

  //Split "foo.bar" to ["foo", "bar"] if key is a string
  function keyToArray(key){
    if (!key) return [];
    if (typeof key != "string") return key;
    return key.split('.');
  };

  function locale(){
    return I18n.locale || I18n.defaultLocale;
  };

  function getLocaleFromCookie(){
    var cookies = document.cookie.split(/\s*;\s*/),
        i, pair, locale;
    for (i = 0; i < cookies.length; i++) {
      pair = cookies[i].split('=');
      if (pair[0] === 'locale') { locale = pair[1]; break; }
    }
    return locale;
  };


  I18n.init = function(){
    this.locale = getLocaleFromCookie();
  };

  //Works mostly the same as the Ruby equivalent, except there are
  //no symbols in JavaScript, so keys are always strings. The only time
  //this makes a difference is when differentiating between keys and values
  //in the defaultValue option. Strings starting with ":" will be considered
  //to be keys and used for lookup, while other strings are returned as-is.
  I18n.translate = function(key, opts){
    if (typeof key != "string") { //Bulk lookup
      var a = [], i;
      for (i=0; i<key.length; i++) {
        a.push(this.translate(key[i], opts));
      }
      return a;
    } else {
      opts = opts || {};
      opts.defaultValue = opts.defaultValue || null;
      key = keyToArray(opts.scope).concat(keyToArray(key));
      var value = this.lookup(key, opts.defaultValue);
      if (typeof value != "string" && value) value = this.pluralize(value, opts.count);
      if (typeof value == "string") value = interpolate(value, opts);
      return value;
    }
  };

  I18n.t = I18n.translate;

  //Looks up a translation using an array of strings where the last
  //is the key and any string before that define the scope. The current
  //locale is always prepended and does not need to be provided. The second
  //parameter is an array of strings used as defaults if the key can not be
  //found. If a key starts with ":" it is used as a key for lookup.
  //This method does not perform pluralization or interpolation.
  I18n.lookup = function(keys, defaults){
    var i = 0, value = this.translations[locale()];
    defaults = typeof defaults == "string" ? [defaults] : (defaults || []);
    while (keys[i]) {
      value = value && value[keys[i]];
      i++;
    }
    if (value){
      return value;
    } else {
      if (defaults.length == 0) {
        return null;
      } else if (defaults[0].substr(0,1) == ':') {
        return this.lookup(keys.slice(0,keys.length-1).concat(keyToArray(defaults[0].substr(1))), defaults.slice(1));
      } else {
        return defaults[0];
      }
    }
  };

  I18n.pluralize = function(value, count){
    if (!count) return value;
    return count == 1 ? value.one : value.other;
  };

})();

I18n.init();

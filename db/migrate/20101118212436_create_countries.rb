class CreateCountries < ActiveRecord::Migration
  def self.up
    create_table :countries do |t|
      t.string :i18n_name
      t.timestamps
    end

    countries = ["afghanistan", "aland_islands", "albania", "algeria", "american_samoa", "andorra", "angola",
    "anguilla", "antarctica", "antigua_and_barbuda", "argentina", "armenia", "aruba", "australia", "austria",
    "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin",
    "bermuda", "bhutan", "bolivia", "bosnia_and_herzegowina", "botswana", "bouvet_island", "brazil",
    "british_indian_ocean_territory", "brunei_darussalam", "bulgaria", "burkina_faso", "burundi", "cambodia",
    "cameroon", "canada", "cape_verde", "cayman_islands", "central_african_republic", "chad", "chile", "china",
    "christmas_island", "cocos_islands", "colombia", "comoros", "congo",
    "congo_the_democratic_republic_of_the", "cook_islands", "costa_rica", "cote_divoire", "croatia", "cuba",
    "cyprus", "czech_republic", "denmark", "djibouti", "dominica", "dominican_republic", "ecuador", "egypt",
    "el_salvador", "equatorial_guinea", "eritrea", "estonia", "ethiopia", "falkland_islands",
    "faroe_islands", "fiji", "finland", "france", "french_guiana", "french_polynesia",
    "french_southern_territories", "gabon", "gambia", "georgia", "germany", "ghana", "gibraltar", "greece", "greenland", "grenada", "guadeloupe", "guam", "guatemala", "guernsey", "guinea",
    "guinea_bissau", "guyana", "haiti", "heard_and_mcdonald_islands", "holy_see",
    "honduras", "hong_kong", "hungary", "iceland", "india", "indonesia", "iran", "iraq",
    "ireland", "isle_of_man", "israel", "italy", "jamaica", "japan", "jersey", "jordan", "kazakhstan", "kenya",
    "kiribati", "korea_democratic_peoples_republic_of", "korea_republic_of", "kuwait", "kyrgyzstan",
    "lao_peoples_democratic_republic", "latvia", "lebanon", "lesotho", "liberia", "libyan_arab_jamahiriya",
    "liechtenstein", "lithuania", "luxembourg", "macao", "macedonia_the_former_yugoslav_republic_of",
    "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "marshall_islands", "martinique",
    "mauritania", "mauritius", "mayotte", "mexico", "micronesia_federated_states_of", "moldova_republic_of",
    "monaco", "mongolia", "montenegro", "montserrat", "morocco", "mozambique", "myanmar", "namibia", "nauru",
    "nepal", "netherlands", "netherlands_antilles", "new_caledonia", "new_zealand", "nicaragua", "niger",
    "nigeria", "niue", "norfolk_island", "northern_mariana_islands", "norway", "oman", "pakistan", "palau",
    "palestinian_territory_occupied", "panama", "papua_new_guinea", "paraguay", "peru", "philippines",
    "pitcairn", "poland", "portugal", "puerto_rico", "qatar", "reunion", "romania", "russian_federation",
    "rwanda", "saint_barthelemy", "saint_helena", "saint_kitts_and_nevis", "saint_lucia",
    "saint_pierre_and_miquelon", "saint_vincent_and_the_grenadines", "samoa", "san_marino",
    "sao_tome_and_principe", "saudi_arabia", "senegal", "serbia", "seychelles", "sierra_leone", "singapore",
    "slovakia", "slovenia", "solomon_islands", "somalia", "south_africa",
    "south_georgia_and_the_south_sandwich_islands", "spain", "sri_lanka", "sudan", "suriname",
    "svalbard_and_jan_mayen", "swaziland", "sweden", "switzerland", "syrian_arab_republic",
    "taiwan_province_of_china", "tajikistan", "tanzania_united_republic_of", "thailand", "timor_leste",
    "togo", "tokelau", "tonga", "trinidad_and_tobago", "tunisia", "turkey", "turkmenistan",
    "turks_and_caicos_islands", "tuvalu", "uganda", "ukraine", "united_arab_emirates", "united_kingdom",
    "united_states", "united_states_minor_outlying_islands", "uruguay", "uzbekistan", "vanuatu", "venezuela",
    "viet_nam", "virgin_islands_british", "virgin_islands_us", "wallis_and_futuna", "western_sahara",
    "yemen", "zambia", "zimbabwe"]

    Country.create(countries.map { |i| {:i18n_name => i} })
  end

  def self.down
    drop_table :countries
  end
end

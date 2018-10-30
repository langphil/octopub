# == Schema Information
#
# Table name: models
#
#  id                :integer          not null, primary key
#  name              :string
#  description       :text
#  schema            :json
#  created_at        :datetime
#  updated_at        :datetime

class Model < ApplicationRecord
  belongs_to :user
	has_many :model_schema_field

	validates_presence_of :user_id # Hidden field

	def json_table_schema
    @json_table_schema ||= JsonTableSchema::Schema.new(JSON.parse(schema))
  end

end
ALTER TABLE communications ADD COLUMN user_id UUID;
CREATE INDEX idx_communications_user_id ON communications(user_id);

-- Run this command in your Supabase SQL Editor to enable the image edit limit
ALTER TABLE raffles ADD COLUMN IF NOT EXISTS image_edit_count INTEGER DEFAULT 0;

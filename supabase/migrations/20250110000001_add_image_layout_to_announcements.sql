-- Add image_layout column to announcements table
-- This column stores the layout type for displaying images in smart sign announcements

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'image_layout') THEN
        ALTER TABLE announcements ADD COLUMN image_layout TEXT;
        
        -- Add comment explaining the column
        COMMENT ON COLUMN announcements.image_layout IS 'Layout type for displaying announcement images. Valid values: hero, split-left, split-right, card, masonry, overlay, side-panel, background';
    END IF;
END $$;


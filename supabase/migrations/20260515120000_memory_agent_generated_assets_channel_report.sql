-- Allow `report` as a generated-asset channel (aligned with app types / PATCH validation).

ALTER TABLE memory_agent_generated_assets
  DROP CONSTRAINT IF EXISTS memory_agent_generated_assets_channel_check;

ALTER TABLE memory_agent_generated_assets
  ADD CONSTRAINT memory_agent_generated_assets_channel_check CHECK (
    channel IS NULL
    OR channel IN ('web', 'lobby_signage', 'qr_handoff', 'staff_brief', 'leadership', 'report')
  );

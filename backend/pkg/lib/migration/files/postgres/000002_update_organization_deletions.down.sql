DROP TABLE organization_deletion_reasons;

ALTER TABLE organization_deletions
  RENAME COLUMN detail TO details;

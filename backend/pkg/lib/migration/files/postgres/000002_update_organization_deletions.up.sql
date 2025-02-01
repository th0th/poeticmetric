CREATE TABLE organization_deletion_reasons (
  detail_title text,
  "order" integer NOT NULL
    PRIMARY KEY,
  reason text NOT NULL
);

INSERT INTO organization_deletion_reasons (
  detail_title,
  "order",
  reason
)
VALUES (
  'What is missing?',
  1,
  'The service didn''t meet my requirements.'
),(
  NULL,
  2,
  'I can''t afford the service.'
),(
  'Who are you leaving us for? :(',
  3,
  'I started using another app.'
),(
  'What is it that didn''t work for you?',
  4,
  'I experienced some problems (bugs, incorrect stats).'
),(
  NULL,
  5,
  'I had issues adding PoeticMetric to my site.'
), (
  NULL,
  6,
  'It is too complex to use PoeticMetric.'
),(
  'What did go wrong?',
  7,
  'Other.'
);

ALTER TABLE organization_deletions
  RENAME COLUMN details TO detail;

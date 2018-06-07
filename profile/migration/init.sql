-- Create the default schema
CREATE SCHEMA IF NOT EXISTS kraken AUTHORIZATION kraken;

-- Add permissions to the admin user and application role
GRANT ALL ON SCHEMA kraken TO kraken;

DROP TABLE IF EXISTS transaction;

CREATE TABLE transaction
(
  transaction_id      BIGSERIAL PRIMARY KEY                                              NOT NULL,
  involves_watch_only BOOLEAN                                                            NOT NULL,
  wallet_conflicts    BOOLEAN                                                            NOT NULL DEFAULT FALSE,
  removed             BOOLEAN                                                            NOT NULL DEFAULT FALSE,
  address             VARCHAR(64)                                                        NOT NULL,
  category            VARCHAR(16),
  amount              INT                                                                NOT NULL,
  label               VARCHAR(256)                                                       NULL,
  confirmations       INT                                                                NOT NULL,
  block_index         INT                                                                NOT NULL,
  vout                INT                                                                NOT NULL,
  block_hash          VARCHAR(128)                                                       NOT NULL,
  tx_id               VARCHAR(128)                                                       NOT NULL,
  block_time          TIMESTAMP                                                          NULL,
  time                TIMESTAMP                                                          NULL,
  time_received       TIMESTAMP                                                          NULL,
  bip125_replaceable  VARCHAR(128)                                                       NOT NULL,
  last_block          VARCHAR(128)                                                       NOT NULL
);
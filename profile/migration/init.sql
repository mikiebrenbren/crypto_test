-- Create the default schema
CREATE SCHEMA IF NOT EXISTS kraken AUTHORIZATION kraken;

-- Add permissions to the admin user and application role
GRANT ALL ON SCHEMA kraken TO kraken;

DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS transaction;

CREATE TABLE transaction
(
  transaction_id      BIGSERIAL PRIMARY KEY                                              NOT NULL,
  amount              DOUBLE PRECISION                                                   NOT NULL,
  confirmations       INT                                                                NOT NULL,
  address             VARCHAR(64)                                                        NOT NULL,
  last_block          VARCHAR(128)                                                       NOT NULL,
  block_hash          VARCHAR(128)                                                       NOT NULL,
  tx_id               VARCHAR(128)                                                       NOT NULL,
  block_index         INT                                                                NOT NULL,
  label               VARCHAR(256)                                                       NULL,
  category            VARCHAR(16)                                                        NOT NULL,
  vout                INT                                                                NOT NULL,
  block_time          TIMESTAMP                                                          NULL,
  time                TIMESTAMP                                                          NULL,
  time_received       TIMESTAMP                                                          NULL,
  bip125_replaceable  VARCHAR(128)                                                       NOT NULL,
  involves_watch_only BOOLEAN                                                            NOT NULL,
  wallet_conflicts    BOOLEAN                                                            NOT NULL DEFAULT FALSE,
  removed             BOOLEAN                                                            NOT NULL DEFAULT FALSE
);

CREATE TABLE customer
(
  customer_id         BIGSERIAL PRIMARY KEY                                              NOT NULL,
  name                VARCHAR(256)                                                       NULL,
  address             VARCHAR(64)                                                        NOT NULL,
  weight              INT                                                                NOT NULL
);
/*
  # Initial Schema Setup

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `ip_address` (text)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
      - `used` (boolean)
    - `test_results`
      - `id` (uuid, primary key)
      - `api_key_id` (uuid, foreign key)
      - `operations` (integer)
      - `success_rate` (float)
      - `avg_response_time` (float)
      - `score` (float)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id),
  operations integer NOT NULL,
  success_rate float NOT NULL,
  avg_response_time float NOT NULL,
  score float NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create api keys"
  ON api_keys
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read unused api keys"
  ON api_keys
  FOR SELECT
  TO public
  USING (NOT used);

CREATE POLICY "Anyone can update their api key"
  ON api_keys
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can read test results"
  ON test_results
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create test results"
  ON test_results
  FOR INSERT
  TO public
  WITH CHECK (true);
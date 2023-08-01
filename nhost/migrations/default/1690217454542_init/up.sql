SET ROLE postgres;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

SET check_function_bodies = false;
CREATE TABLE public.kuzers (
    id uuid NOT NULL,
    name varchar,
    geohash character varying,
    geopoint geography,
    "messageStatistics" jsonb DEFAULT '{"sentCount": {}, "receivedCount": {}, "sentTotalCount": 0, "receivedTotalCount": 0, "averageSentDistance": 0, "averageReceivedDistance": 0}'::jsonb NOT NULL,
    status character varying DEFAULT 'online'::character varying NOT NULL,
    "lastOnline" timestamptz DEFAULT now() NOT NULL,
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.kuzers
    ADD CONSTRAINT kuzers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.kuzers
    ADD CONSTRAINT kuzers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

-- CREATE INDEX kuzers_geohash_index ON public.kuzers USING btree (geohash);

CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  slug varchar NOT NULL,
  emoji varchar NOT NULL,
  translations jsonb NOT NULL,
  "createdAt" timestamptz DEFAULT now() NOT NULL,
  "updatedAt" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE public.messages ADD CONSTRAINT messages_slug_unique UNIQUE (slug);

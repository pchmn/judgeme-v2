CREATE TABLE public.installations (
  id varchar NOT NULL,
  "deviceName" varchar,
  "osName" varchar,
  "osVersion" varchar,
  "pushToken" varchar NOT NULL,
  "isActive" bool DEFAULT 'true' NOT NULL,
  kuzer_id uuid NOT NULL,
  "appVersion" varchar NOT NULL,
  "appIdentifier" varchar NOT NULL,
  "deviceType" varchar NOT NULL,
  "deviceLocale" varchar NOT NULL,
  "createdAt" timestamptz DEFAULT now() NOT NULL,
  "updatedAt" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("id", "kuzer_id"),
  FOREIGN KEY (kuzer_id) REFERENCES public.kuzers (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

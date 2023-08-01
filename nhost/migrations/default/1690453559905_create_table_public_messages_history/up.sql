CREATE TABLE public.messages_history (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  message_id uuid NOT NULL,
  from_kuzer_id uuid NOT NULL,
  to_kuzer_id uuid NOT NULL,
  distance numeric NOT NULL,
  "sentAt" timestamptz NOT NULL,
  "createdAt" timestamptz DEFAULT now() NOT NULL,
  "updatedAt" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (message_id) REFERENCES public.messages (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (from_kuzer_id) REFERENCES public.kuzers (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (to_kuzer_id) REFERENCES public.kuzers (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX messages_history_message_id_index ON messages_history (message_id);

CREATE INDEX messages_history_to_kuzer_id_index ON messages_history (to_kuzer_id);

CREATE INDEX messages_history_from_kuzer_id_index ON messages_history (from_kuzer_id);

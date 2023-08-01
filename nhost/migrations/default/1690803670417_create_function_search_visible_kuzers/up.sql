CREATE TABLE visible_kuzers (
  id uuid,
  name varchar,
  status varchar,
  "messageStatistics" json,
  geopoint geography(point),
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  "lastOnline" timestamptz
);

CREATE FUNCTION search_visible_kuzers(min_lat float, min_long float, max_lat float, max_long float)
RETURNS SETOF visible_kuzers AS $$
	SELECT id, name, status, "messageStatistics", geopoint, "createdAt", "updatedAt", "lastOnline"
	FROM kuzers
	WHERE st_astext(geopoint) && ST_SetSRID(ST_MakeBox2D(ST_Point(min_long, min_lat), ST_Point(max_long, max_lat)), 4326)
$$ LANGUAGE sql STABLE;

import { distanceBetween as geofireDistanceBetween } from 'geofire-common';

import { LatLng } from '../models';

export function distanceBetween(from: LatLng, to: LatLng) {
  return geofireDistanceBetween([from.latitude, from.longitude], [to.latitude, to.longitude]);
}

export function formatDistance(distance: number) {
  return distance < 1 ? Math.round(distance * 1000) + 'm' : Math.round(distance) + 'km';
}

export function formatDistanceBetween(from: LatLng | [number, number], to: LatLng | [number, number]) {
  if (Array.isArray(from)) from = { latitude: from[1], longitude: from[0] };
  if (Array.isArray(to)) to = { latitude: to[1], longitude: to[0] };
  const distance = distanceBetween(from, to);

  return formatDistance(distance);
}

import { distanceBetween as geofireDistanceBetween } from 'geofire-common';

import { GeoPoint } from '../models';

export function distanceBetween(from: GeoPoint, to: GeoPoint) {
  return geofireDistanceBetween([from.latitude, from.longitude], [to.latitude, to.longitude]);
}

export function formatDistance(distance: number) {
  return distance < 1 ? Math.round(distance * 1000) + 'm' : Math.round(distance) + 'km';
}

export function formatDistanceBetween(from: GeoPoint, to: GeoPoint) {
  const distance = distanceBetween(from, to);

  return formatDistance(distance);
}

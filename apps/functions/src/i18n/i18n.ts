export const translations = {
  en: {
    from: (distanceInKm: number) =>
      `From ${distanceInKm < 1 ? Math.round(distanceInKm * 1000) + 'm' : distanceInKm + 'km'} away`,
  },
  fr: {
    from: (distanceInKm: number) =>
      `À ${distanceInKm < 1 ? Math.round(distanceInKm * 1000) + 'm' : distanceInKm + 'km'}`,
  },
};

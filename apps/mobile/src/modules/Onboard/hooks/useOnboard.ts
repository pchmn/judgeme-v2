import { getForegroundPermissionsAsync } from 'expo-location';
import { getPermissionsAsync as getNotificationsPermissionsAsync } from 'expo-notifications';
import { useEffect, useState } from 'react';

interface OnboardView {
  page: number;
  name: 'explanation' | 'location' | 'notifications';
  isCompleted?: boolean;
}

export function useOnboard() {
  const [viewsToShow, setViewsToShow] = useState<OnboardView[]>([]);

  useEffect(() => {
    const checkPermissions = async () => {
      const notificationsPermissions = await getNotificationsPermissionsAsync();
      const locationPermissions = await getForegroundPermissionsAsync();

      let page = 0;
      const views: OnboardView[] = [{ name: 'explanation', page }];
      if (!locationPermissions.granted) {
        page++;
        views.push({ name: 'location', page });
      }
      if (!notificationsPermissions.granted) {
        page++;
        views.push({ name: 'notifications', page });
      }
      setViewsToShow(views);
    };
    checkPermissions();
  }, []);

  return {
    viewsToShow: viewsToShow.sort((a, b) => a.page - b.page),
    isLoading: viewsToShow.length === 0,
  };
}

import { Flex } from '@kavout/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRef } from 'react';
import PagerView from 'react-native-pager-view';

import { RouteParams } from '@/core/routes/types';

import { ExplanationView, LocationPermissionView } from './components';

export function OnboardScreen() {
  const { params } = useRoute<RouteParams<'Onboard'>>();
  const navigation = useNavigation();

  const pagerViewRef = useRef<PagerView>(null);

  const setPage = (page: number) => {
    pagerViewRef.current?.setPage(page);
  };

  return (
    <Flex flex={1}>
      <PagerView ref={pagerViewRef} style={{ flex: 1 }} initialPage={params.page} scrollEnabled={false}>
        <ExplanationView onNext={() => setPage(1)} key="1" />
        <LocationPermissionView key="2" onNext={() => navigation.navigate({ key: 'Home' })} />
      </PagerView>
    </Flex>
  );
}

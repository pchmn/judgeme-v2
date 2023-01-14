import { Flex } from '@kavout/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { RouteParams } from '@/core/routes/types';

import { ExplanationView } from './ExplanationView';
import { LocationPermissionView } from './LocationPermissionView';

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function OnboardScreen() {
  const { params } = useRoute<RouteParams<'Onboard'>>();
  const navigation = useNavigation();

  const pagerViewRef = useRef<PagerView>(null);

  const setPage = (page: number) => {
    pagerViewRef.current?.setPage(page);
  };

  return (
    <Flex flex={1}>
      <PagerView ref={pagerViewRef} style={styles.viewPager} initialPage={params.page} scrollEnabled={false}>
        <ExplanationView onNext={() => setPage(1)} key="1" />
        <LocationPermissionView key="2" onNext={() => navigation.navigate('Home')} />
      </PagerView>
    </Flex>
  );
}

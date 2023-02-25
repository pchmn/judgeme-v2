import { Flex } from '@kavout/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { useTheme } from 'react-native-paper';

import { RouteParams } from '@/core/routes/types';

import { ExplanationView, LocationPermissionView } from './components';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export function OnboardScreen() {
  const { params } = useRoute<RouteParams<'Onboard'>>();
  const navigation = useNavigation();

  const theme = useTheme();

  const pagerViewRef = useRef<PagerView>(null);
  const width = Dimensions.get('window').width;
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const inputRange = [0, 2];
  const scrollX = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate({
    inputRange,
    outputRange: [0, 2 * width],
  });

  const setPage = (page: number) => {
    pagerViewRef.current?.setPage(page);
  };

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Flex flex={1} gap={20}>
      <AnimatedPagerView ref={pagerViewRef} style={{ flex: 1 }} initialPage={params.page} onPageScroll={onPageScroll}>
        <ExplanationView onNext={() => setPage(1)} key="1" />
        <LocationPermissionView key="2" onNext={() => navigation.navigate('Home', {})} />
      </AnimatedPagerView>
      <ExpandingDot
        data={[1, 2]}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        scrollX={scrollX}
        inActiveDotOpacity={0.3}
        activeDotColor={theme.colors.primary}
        inActiveDotColor={theme.colors.primary}
        expandingDotWidth={20}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 5,
        }}
        containerStyle={{
          position: 'relative',
        }}
      />
    </Flex>
  );
}

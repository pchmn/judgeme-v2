import { Flex } from '@kavout/react-native';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { useTheme } from 'react-native-paper';

import { ExplanationView, LocationPermissionView, NotificationsPermissionView } from './components';
import { useIsFirstLaunch } from './hooks';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface OnboardView {
  page: number;
  name: 'explanation' | 'location' | 'notifications';
  isCompleted?: boolean;
}

const onboardViews: OnboardView[] = [
  { name: 'explanation', page: 0 },
  { name: 'location', page: 1 },
  { name: 'notifications', page: 2 },
];

export function OnboardScreen() {
  const { set: setIsFirstLaunch } = useIsFirstLaunch();

  const navigation = useNavigation();

  const theme = useTheme();

  const pagerViewRef = useRef<PagerView>(null);
  const width = Dimensions.get('window').width;
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const inputRange = [0, onboardViews.length];
  const scrollX = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate({
    inputRange,
    outputRange: [0, onboardViews.length * width],
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

  const handleNext = (from: 'explanation' | 'location' | 'notifications') => {
    const view = onboardViews.find(({ name }) => name === from);

    if (view) {
      view.isCompleted = true;
      const nextView = onboardViews.find(({ isCompleted }) => !isCompleted);
      if (nextView) {
        setPage(nextView.page);
      } else {
        goToHome();
      }
    }
  };

  const goToHome = () => {
    setIsFirstLaunch(false);
    navigation.navigate('Home', {});
  };

  return (
    <Flex flex={1} gap={20}>
      <AnimatedPagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageScroll={onPageScroll}
        scrollEnabled={true}
      >
        {onboardViews.map(({ name }) => {
          switch (name) {
            case 'explanation':
              return <ExplanationView key="0" onNext={() => handleNext('explanation')} />;
            case 'location':
              return <LocationPermissionView key="1" onNext={() => handleNext('location')} />;
            case 'notifications':
              return (
                <NotificationsPermissionView key="2" onNext={() => handleNext('notifications')} onSkip={goToHome} />
              );
          }
        })}
      </AnimatedPagerView>
      <ExpandingDot
        data={onboardViews}
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

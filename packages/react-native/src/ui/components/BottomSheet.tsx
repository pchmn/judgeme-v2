import React, { useCallback, useImperativeHandle, useMemo } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type BottomSheetProps = {
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  onIndexChange?: (index: number) => void;
  onPositionChange?: (position: number) => void;
};

export type BottomSheetRefProps = {
  snapToPosition: (destination: number) => void;
  snapToIndex: (index: number) => void;
  toggle: () => void;
};

// eslint-disable-next-line react/display-name
export const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, containerStyle, indicatorStyle, onIndexChange, onPositionChange }, ref) => {
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => [insets.top, -SCREEN_HEIGHT * 0.45, -SCREEN_HEIGHT + insets.top], [insets.top]);

    const translateY = useSharedValue(insets.top);
    const index = useSharedValue(0);
    const active = useSharedValue(false);

    const distanceBetween = (positionA: number, positionB: number) => {
      'worklet';
      return Math.abs(positionA - positionB);
    };

    const snapToPosition = useCallback(
      (destination: number) => {
        'worklet';
        active.value = destination < snapPoints[0];
        const newIndex = snapPoints.findIndex((snapPoint) => snapPoint === destination);
        if (newIndex !== -1) {
          index.value = newIndex;
        }
        translateY.value = withSpring(destination, { damping: 20, stiffness: 150, mass: 0.15 });
      },
      [active, index, snapPoints, translateY]
    );

    const snapToIndex = useCallback(
      (index: number) => {
        'worklet';
        const toIndex = Math.max(0, Math.min(index, 2));
        snapToPosition(snapPoints[toIndex]);
      },
      [snapToPosition, snapPoints]
    );

    const toggle = useCallback(() => {
      if (active.value) {
        snapToIndex(0);
      } else {
        snapToIndex(1);
      }
    }, [active.value, snapToIndex]);

    useImperativeHandle(ref, () => ({ snapToPosition, snapToIndex, toggle }), [snapToPosition, snapToIndex, toggle]);

    useDerivedValue(() => {
      if (onPositionChange) {
        runOnJS(onPositionChange)(translateY.value);
      }
    });

    useDerivedValue(() => {
      if (onIndexChange) {
        runOnJS(onIndexChange)(index.value);
      }
    });

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = Math.max(event.translationY + context.value.y, snapPoints[2]);
      })
      .onEnd((event) => {
        if (event.velocityY < -1000) {
          snapToIndex(index.value + 1);
          return;
        }

        if (event.velocityY > 1000) {
          snapToIndex(index.value - 1);
          return;
        }

        const distanceBetweenPoints = distanceBetween(
          snapPoints[index.value],
          event.translationY > 0 ? snapPoints[Math.max(index.value - 1, 0)] : snapPoints[Math.min(index.value + 1, 2)]
        );

        if (Math.abs(event.translationY) > 0.15 * distanceBetweenPoints) {
          if (event.translationY > 0) {
            snapToIndex(index.value - 1);
          } else {
            snapToIndex(index.value + 1);
          }
        } else {
          snapToIndex(index.value);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              height: SCREEN_HEIGHT,
              width: '100%',
              backgroundColor: 'white',
              position: 'absolute',
              top: SCREEN_HEIGHT,
              ...containerStyle,
            },
            rBottomSheetStyle,
          ]}
        >
          <View
            style={{
              width: 25,
              height: 4,
              backgroundColor: 'grey',
              alignSelf: 'center',
              marginVertical: 15,
              borderRadius: 2,
              ...indicatorStyle,
            }}
          />
          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

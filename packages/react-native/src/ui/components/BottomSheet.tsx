import React, { useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { IconButton, useTheme } from 'react-native-paper';
import Animated, {
  Extrapolate,
  FadeInUp,
  FadeOutUp,
  interpolate,
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
  willMoveToIndex?: (index: number) => void;
};

export type BottomSheetRefProps = {
  snapToPosition: (destination: number) => void;
  snapToIndex: (index: number) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

// eslint-disable-next-line react/display-name
export const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, containerStyle, indicatorStyle, onIndexChange, onPositionChange, willMoveToIndex }, ref) => {
    const insets = useSafeAreaInsets();

    const theme = useTheme();

    const bottomSheetTop = insets.top + 30;
    const topViewHeight = bottomSheetTop + 20;

    const snapPoints = useMemo(
      () => [insets.top, -SCREEN_HEIGHT * 0.45, -SCREEN_HEIGHT + bottomSheetTop],
      [bottomSheetTop, insets.top]
    );

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
        translateY.value = withSpring(destination, { damping: 20, stiffness: 150, mass: 0.1 });
      },
      [active, index, snapPoints, translateY]
    );

    const snapToIndex = useCallback(
      (index: number) => {
        'worklet';
        const toIndex = Math.max(0, Math.min(index, 2));
        if (willMoveToIndex) {
          runOnJS(willMoveToIndex)(toIndex);
        }
        snapToPosition(snapPoints[toIndex]);
      },
      [willMoveToIndex, snapToPosition, snapPoints]
    );

    const toggle = useCallback(() => {
      if (active.value) {
        snapToIndex(0);
      } else {
        snapToIndex(1);
      }
    }, [active.value, snapToIndex]);

    const close = useCallback(() => {
      if (active.value) {
        snapToIndex(0);
      }
    }, [active.value, snapToIndex]);

    const open = useCallback(() => {
      if (!active.value) {
        snapToIndex(1);
      }
    }, [active.value, snapToIndex]);

    useImperativeHandle(ref, () => ({ snapToPosition, snapToIndex, toggle, open, close }), [
      snapToPosition,
      snapToIndex,
      toggle,
      open,
      close,
    ]);

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
      const borderRadius = interpolate(translateY.value, [snapPoints[1], snapPoints[2]], [10, 0], Extrapolate.CLAMP);

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const [showTopView, setShowTopView] = useState(false);
    useDerivedValue(() => {
      const show = translateY.value < snapPoints[2] + 30;
      if (show !== showTopView) {
        runOnJS(setShowTopView)(show);
      }
    });

    return (
      <>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              {
                height: SCREEN_HEIGHT,
                width: '100%',
                backgroundColor: theme.colors.surface,
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
                backgroundColor: theme.colors.onSurface,
                alignSelf: 'center',
                marginVertical: 15,
                borderRadius: 2,
                ...indicatorStyle,
              }}
            />
            {children}
          </Animated.View>
        </GestureDetector>
        {showTopView && (
          <Animated.View
            style={[
              {
                backgroundColor: theme.colors.surface,
                position: 'absolute',
                top: 0,
                height: topViewHeight,
                width: '100%',
                justifyContent: 'flex-end',
              },
              // rTopViewStyle,
            ]}
            entering={FadeInUp.damping(20).stiffness(150).mass(0.1).duration(100)}
            exiting={FadeOutUp.damping(20).stiffness(150).mass(0.1).duration(100)}
          >
            <IconButton icon="chevron-down" size={30} onPress={() => snapToIndex(index.value - 1)} />
          </Animated.View>
        )}
      </>
    );
  }
);

import { useRef } from "react";
import {
  Animated,
  Dimensions,
  View,
  PanResponder,
  Modal,
  StyleSheet,
} from "react-native";
export default function AnimatedModal({
  children,
  isVisible,
  onClose = () => {},
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
        Animated.spring(pan.y, {
          toValue: Dimensions.get("window").height,
          tension: 1,
          friction: 20,
          useNativeDriver: true,
        }).start();
        pan.current.setValue(0);
      } else {
        Animated.spring(pan.y, {
          toValue: 0,
          tension: 1,
          friction: 20,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Modal visible={isVisible} transparent={true}>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          ...styles.container,
          transform: [{ translateY: pan.y }],
        }}
      >
        <View style={styles.bar} />
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    top: 0,
  },
  bar: {
    height: 4,
    width: 100,
    borderRadius: 10,
    backgroundColor: "#999",
    marginHorizontal: "auto",
    marginBottom: 20,
  },
});
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function App() {
  const theme = useTheme();

  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
        Press me
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

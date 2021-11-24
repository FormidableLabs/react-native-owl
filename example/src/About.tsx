import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

export const About: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Pressable
        style={styles.button}
        testID="CLOSE_BUTTON"
        onPress={() => onClose()}
      >
        <Text style={styles.buttonText}>×</Text>
      </Pressable>

      <View style={styles.main}>
        <Text style={styles.owl}>🦉</Text>
        <Text style={[styles.footerText, styles.highlight]}>
          react-native-owl
        </Text>
        <Text style={styles.footerText}>Brought to you by Formidable.</Text>

        <TextInput
          testID="TEST_INPUT"
          placeholder="Test input"
          style={styles.input}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginHorizontal: 24,
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24 * 2,
  },
  owl: {
    fontSize: 100,
    marginBottom: 12,
  },
  highlight: {
    fontWeight: '700',
  },
  footerText: {
    fontSize: 22,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 20,
  },
});

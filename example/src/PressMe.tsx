import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import { PressMeButton } from './PressMe.button';

export const PressMe = () => {
  const [text, setText] = React.useState('');
  const [isLongPressed, setIsLongPressed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
        setIsLoaded(true);
      }, 1500);
    }
  }, [isLoading]);

  return (
    <View style={styles.header}>
      {!isLoaded && !isLoading && (
        <Pressable
          testID="Pressable"
          onPress={() => setIsLoading(true)}
          onLongPress={() => setIsLongPressed(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Press Me</Text>
          <Text style={styles.buttonArrow}>&#8594;</Text>
        </Pressable>
      )}

      {isLoading && <ActivityIndicator />}

      {isLongPressed && !isLoading && !isLoaded && (
        <Text style={styles.textLongPressed}>Long Pressed!</Text>
      )}

      {!isLoading && isLoaded && (
        <>
          <Text style={styles.textInputLabel}>This is a label *</Text>

          <TextInput
            testID="TextInput"
            placeholder="Type something here"
            onChangeText={setText}
            value={text}
            style={styles.textInput}
          />

          <PressMeButton />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginVertical: 35,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    paddingVertical: 7.5,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  textLongPressed: {
    marginTop: 35,
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  textInputLabel: {
    fontWeight: '600',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  highlight: {
    fontWeight: '700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonArrow: {
    fontSize: 20,
  },
});

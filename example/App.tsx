import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{children}</Text>
    </View>
  );
};

const App = () => {
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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      testID="ScrollView"
    >
      <StatusBar barStyle="dark-content" />

      <Image source={require('./assets/logo.png')} style={styles.logo} />

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
          </>
        )}
      </View>

      <Section title="Setup">
        Install <Text style={styles.highlight}>react-native-owl</Text> and
        follow the instructions in the documentation to complete the setup. Note
        that you will have to do some platform specific setup for iOS & Android.
      </Section>

      <Section title="Baseline Screenshots">
        Generate, validate and commit the baseline images. These will be used
        for the comparison, every time you run the tests suite.
      </Section>

      <Section title="Generated Report">
        If your tests are failing, you can view the generated report which will
        display any differences between the baselines and fresh screenshots.
      </Section>

      <Section title="Scroll Content">
        This text is in place only for demo purposes.
      </Section>

      <Section title="Scroll-to-end Content">
        This text is in place only for demo purposes.
      </Section>
    </ScrollView>
  );
};

const colors = {
  SLATE_200: '#e2e8f0',
  SLATE_500: '#64748b',
  GRAY_800: '#1f2937',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SLATE_200,
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  logo: {
    width: 175,
    height: 175,
    alignSelf: 'center',
  },
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonArrow: {
    fontSize: 20,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: colors.GRAY_800,
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
});

export default App;

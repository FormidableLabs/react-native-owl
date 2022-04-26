import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to OWL Demo</Text>
      <View style={{ paddingVertical: 48 }} />
      <Pressable
        testID="home.viewDetails"
        onPress={() => navigation.navigate('DetailsScreen')}
      >
        <Text style={{ textDecorationLine: 'underline', color: 'black' }}>
          View Details
        </Text>
      </Pressable>
    </View>
  );
}

function DetailsScreen({ navigation }) {
  const [text, setText] = React.useState('default text');
  const [isSecretInputVisible, setIsSecretInputVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <ScrollView testID="details.scrollView" style={{ alignItems: 'center' }}>
      <Text style={{ paddingBottom: 48 }}>Details Screen</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Pressable
          testID="details.reveal"
          onPress={() => setIsSecretInputVisible(true)}
        >
          <Text style={{ textDecorationLine: 'underline', color: 'black' }}>
            Reveal secret
          </Text>
        </Pressable>
      )}
      {isSecretInputVisible ? (
        <TextInput
          testID="details.input"
          placeholder="Type something here"
          onChangeText={(newText) => setText(newText)}
          defaultValue={text}
        />
      ) : null}

      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>Content</Text>
      <Text style={{ paddingVertical: 40 }}>End</Text>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="DetailsScreen"
          component={DetailsScreen}
          options={{
            headerLeft: () => <HeaderLeft />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HeaderLeft = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      testID="button.goBack"
      onPress={() => navigation.goBack()}
      style={{ marginRight: 24 }}
    >
      <Text>{'<'}</Text>
    </Pressable>
  );
};

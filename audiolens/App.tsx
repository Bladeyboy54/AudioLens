import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TextRecognitionScreen from './screens/TextRecognitionScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name="TextRecognition" component={TextRecognitionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



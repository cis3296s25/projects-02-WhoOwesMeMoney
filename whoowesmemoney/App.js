import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home.js';
import GalleryScreen from './screens/GalleryScreen.js';
import Person from './screens/Person.js';
import Debtor from './screens/Debtor.js';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Debtor" component={Debtor} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Person" component={Person} />
        <Stack.Screen name="Debtor" component={Debtor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
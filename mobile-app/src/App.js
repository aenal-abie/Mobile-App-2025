import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config-v2';
import SplashScreen from './screens/Auth/SplashScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import HomeScreen from './screens/Main/HomeScreen';
import AddTaskScreen from './screens/Main/AddTaskScreen';
import EditTaskScreen from './screens/Main/EditTaskScreen';
import TaskDetailScreen from './screens/Main/TaskDetailScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import { useAuthStore } from './store/authStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const { pengguna, token, muatSesi } = useAuthStore();
  const [siap, setSiap] = React.useState(false);

  React.useEffect(() => {
    muatSesi().finally(() => setSiap(true));
  }, [muatSesi]);

  if (!siap) {
    return <SplashScreen />;
  }

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!pengguna || !token ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddTask" component={AddTaskScreen} />
              <Stack.Screen name="EditTask" component={EditTaskScreen} />
              <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

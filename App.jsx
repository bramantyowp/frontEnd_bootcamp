import Home from './src/screens/Home';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { navigationRef } from '@config/rootNavigation';

import List from './src/screens/List';
import Akun from './src/screens/Akun';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Detail from './src/screens/Detail';
import Order from './src/screens/Order';
import OrderList from './src/screens/Order/ListOrder';
import { setupAxiosInterceptors } from './src/config/axios';
import GlobalModal from '@components/Modal/GlobalModal';
import { selectUser } from '@reducers/user';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs(){
  const user = useSelector(selectUser)
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: () => <Icon name={'home'} size={25} color="#A43333" />,
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          title: 'Daftar Mobil',
          tabBarIcon: () => <Icon name={'list'} size={25} color="#A43333" />,
        }}
        name="List"
        component={List}
      />
      { user.isLogin &&
        <Tab.Screen
          options={{
            title: 'Daftar Order',
            tabBarIcon: () => <Icon name={'shopping-cart'} size={25} color="#A43333" />,
          }}
          name="OrderList"
          component={OrderList}
        />
      }
      <Tab.Screen
        options={{
          title: 'Akun',
          tabBarIcon: () => <Icon name={'user'} size={25} color="#A43333" />,
        }}
        name="Profile"
        component={Akun}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator/>} persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          {/* <GlobalModal /> */}
          <Stack.Navigator>
            <Stack.Screen options={{
              headerShown:false,
            }} name="HomeTabs" component={Tabs} />
            <Stack.Screen options={{
              headerShown:false,
            }} name="SignIn" component={SignIn} />
            <Stack.Screen options={{
              headerShown:false,
            }} name="SignUp" component={SignUp} />
            <Stack.Screen options={{
              headerShown:false,
            }} name="Detail" component={Detail} />
            <Stack.Screen options={{
              headerShown:false,
            }} name="Order" component={Order} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

setupAxiosInterceptors(store);

export default App;

import "react-native-gesture-handler";
import React from "react";
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from 'react-redux'
import { NativeBaseProvider } from "native-base";
import { PersistGate } from 'redux-persist/integration/react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { ToastContainer } from 'react-native-root-toast'

import { Routes } from "./routes";
import { store, persistor } from './redux'
import { makeServer } from './services/mirage'
import { theme } from './styles/theme'

if(process.env.NODE_ENV === 'development') {
  if((window as any).server) {
    (window as any).server.shutdown();
    (window as any).server = undefined;
  }
  (window as any).server = makeServer()
}

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootSiblingParent>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NativeBaseProvider theme={theme}>
              <StatusBar style='light' backgroundColor="#171717" translucent={false} />
              <Routes />
            </NativeBaseProvider>
          </PersistGate>
        </Provider>
      </RootSiblingParent>
    </NavigationContainer>
  )
}

export default App;

registerRootComponent(App)
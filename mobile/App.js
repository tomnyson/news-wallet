import React, {useState} from 'react'
import AppNavigator from './src/navigations/AppNavigator'
// import 'react-native-reanimated'
import { StripeProvider } from '@stripe/stripe-react-native'
import { Provider } from 'react-redux'
import store from './src/store'

// import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'

// This is the default configuration
// configureReanimatedLogger({
//   level: ReanimatedLogLevel.warn,
//   strict: false, // Reanimated runs in strict mode by default
// })

export default function App() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey="pk_test_51Nc3APDQIUXW6VqVpY5zg2mV11WdnXOMmZbcVmXFuNzpwOVd2v2tTOMIVBIVwgXh4ZnIfxshekrdTh0WpfC5I9oK00pSqsJlI9"
      merchantIdentifier="merchant.identifier"
      urlScheme="your-url-scheme"
      >
        <AppNavigator />
      </StripeProvider>
    </Provider>
  )
}

import 'bootstrap/dist/css/bootstrap.css'

import '../styles/globals.css'

import { Provider } from 'react-redux'

import React, { FC } from 'react'
import { wrapper } from '../store'



const WrappedApp = ({ Component, pageProps }) => {
  
  return <Component {...pageProps} />
  
}

export default wrapper.withRedux(WrappedApp)



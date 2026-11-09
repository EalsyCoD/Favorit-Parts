import { configureStore } from '@reduxjs/toolkit'
import priceReducer from './priceSlice'

const store = configureStore({
  reducer: {
    price: priceReducer,
  },
})

export default store

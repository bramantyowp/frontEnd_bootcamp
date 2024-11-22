import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user';
import carsSlice from './cars';
import orderSlice from './order';
import orderListSlice from './order/list';

const rootReducer = combineReducers({
    user: userSlice,
    cars: carsSlice,
    order: orderSlice,
    orderList: orderListSlice,
})

export default rootReducer;

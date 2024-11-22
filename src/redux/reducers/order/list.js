import { createSlice } from "@reduxjs/toolkit";
import { getOrder, getOrderDetails } from "./api";

const initialState = {
    data: [],
    message: null,
    details: {
        id: null,
        data: {},
        status: "idle",
        message: null,
    },
    status: "idle",
};

const orderListSlice = createSlice({
    name: "orderList",
    initialState,
    reducers: {
        setStateByName: (state, { payload }) => {
            const { name, value } = payload;
            state[name] = value;
        },
        resetDetailsState: (state) => {
            state.details = initialState.details;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOrder.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(getOrder.fulfilled, (state, action) => {
            state.status = 'success';
            console.log(state.data)
            state.data = {...state.data, ...action.payload};
            // state.data['data'] = [...state.data?.data, ...action.payload.data];
        });
        builder.addCase(getOrder.rejected, (state, action) => {
            state.status = 'error';
            state.message = action.payload.data;
        });

        builder.addCase(getOrderDetails.pending, (state, action) => {
            state.details.status = 'loading';
        });
        builder.addCase(getOrderDetails.fulfilled, (state, action) => {
            state.details.status = 'success';
            state.details.data = action.payload.data;
            state.details.id = action.payload.data.id;
            state.details.message = action.payload.message;
            // state.data['data'] = [...state.data?.data, ...action.payload.data];
        });
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.status = 'error';
            state.details.message = action.payload;
        });
    },
});

export { getOrder, getOrderDetails };
export const selectOrderList = state => state.orderList; //selector
export const selectOrderListDetail = state => state.orderList.details;
export const { setStateByName, resetDetailsState } = orderListSlice.actions;
export default orderListSlice.reducer;

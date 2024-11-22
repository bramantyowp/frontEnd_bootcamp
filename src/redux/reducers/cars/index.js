import { createSlice } from "@reduxjs/toolkit";
import { getCars, getCarsDetails } from "./api";

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

const carSlice = createSlice({
    name: "cars",
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
        builder.addCase(getCars.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(getCars.fulfilled, (state, action) => {
            state.status = 'success';
            console.log(state.data)
            state.data = {...state.data, ...action.payload};
            // state.data['data'] = [...state.data?.data, ...action.payload.data];
        });
        builder.addCase(getCars.rejected, (state, action) => {
            state.status = 'error';
            state.message = action.payload.data;
        });

        builder.addCase(getCarsDetails.pending, (state, action) => {
            state.details.status = 'loading';
        });
        builder.addCase(getCarsDetails.fulfilled, (state, action) => {
            state.details.status = 'success';
            state.details.data = action.payload.data;
            state.details.id = action.payload.data.id;
            state.details.message = action.payload.message;
            // state.data['data'] = [...state.data?.data, ...action.payload.data];
        });
        builder.addCase(getCarsDetails.rejected, (state, action) => {
            state.status = 'error';
            state.details.message = action.payload;
        });
    },
});

export { getCars, getCarsDetails };
export const selectCars = state => state.cars; //selector
export const selectCarDetail = state => state.cars.details;
export const { setStateByName, resetDetailsState } = carSlice.actions;
export default carSlice.reducer;

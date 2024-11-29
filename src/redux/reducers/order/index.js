import { createSlice } from '@reduxjs/toolkit';
import { postOrder, putOrderReceipt, cancelOrder, getOrderDetails } from './api';

const now = new Date()

const initialState = {
  isLoading: false,
  carId: null,
  data: {},
  errorMessage: null,
  countdown: null,
  activeStep: 0,
  formData: {
    'car_id': null,
    'start_time': new Date().toString(),
    'end_time': new Date().setDate(),
    'payment_method': null,
    'promo': null,
    'is_driver': false,
  },
  isModalVisible: false,
  status: 'pending',
  // paymentCountdown: null,
  // verificationCountdown: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    setCarId: (state, { payload }) => {
      state.carId = payload;
    },
    setStateByName: (state, { payload }) => {
      const { name, value } = payload;
      state[name] = value;
    },
    setFormData: (state, { payload }) => {
      const { name, value } = payload;
      state.formData[name] = value;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(postOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(postOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.status = 'success';
      // state.isModalVisible = true;
    });
    builder.addCase(postOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.status = 'error';
      state.errorMessage = action.payload;
      // state.isModalVisible = true;
    });

    builder.addCase(getOrderDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.formData = {
        'car_id': action.payload.data.car_id,
        'start_time': action.payload.data.start_time,
        'end_time': action.payload.data.end_time,
        'payment_method': action.payload.data.payment_method,
        'promo': action.payload.data.promo,
        'is_driver': action.payload.data.is_driver,
      }
      state.status = 'success';
      // state.isModalVisible = true;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.status = 'error';
      state.errorMessage = action.payload;
      // state.isModalVisible = true;
    });

    builder.addCase(putOrderReceipt.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(putOrderReceipt.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.status = 'upload-success';
    });
    builder.addCase(putOrderReceipt.rejected, (state, action) => {
      state.isLoading = false;
      // state.isError = true;
      state.errorMessage = action.payload;
      // state.isModalVisible = true;
    });

    builder.addCase(cancelOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.status = 'success';
      // state.isModalVisible = true;
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.status = 'error';
      state.errorMessage = action.payload;
      // state.isModalVisible = true;
    });
  },
});

export { postOrder, putOrderReceipt, cancelOrder, getOrderDetails };
export const { setCarId, setStateByName, resetState, setFormData } = orderSlice.actions;
export const selectOrder = (state) => state.order; //selector
export default orderSlice.reducer;

import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../../config/axios';

export const getOrder = createAsyncThunk(
    'getOrder',
    async ({token, page}, { rejectWithValue}) => {
        try {
            const res = await apiClient('/order/myorder', {
                params:{
                    page: page,
                }
            });
            console.log(res)
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    });

export const getOrderDetails = createAsyncThunk(
    'getOrderDetails',
    async (id , { rejectWithValue }) => {
        try {
            const res = await apiClient('/order/' + id)
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    }
);

export const postOrder = createAsyncThunk(
    'postOrder',
    async (data , { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/order/', data)
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    }
);

export const putOrder = createAsyncThunk(
    'putOrder',
    async ({data, token, id} , { rejectWithValue }) => {
        try {
            const res = await apiClient.put('/order/' + id, data)
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'cancelOrder',
    async (id , { rejectWithValue }) => {
        try {
            const res = await apiClient.put('/order/' + id + '/cancel')
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    }
);

export const putOrderReceipt = createAsyncThunk(
    'putOrderReceipt',
    async ({id, token} , { rejectWithValue }) => {
        try {
            const res = await apiClient.put('/order/' + id + '/receipt')
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    }
);
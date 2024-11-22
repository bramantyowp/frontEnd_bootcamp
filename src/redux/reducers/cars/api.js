import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@config/axios';

export const getCars = createAsyncThunk(
    'getCars',
    async (page, { rejectWithValue}) => {
        try {
            const res = await apiClient('/cars/', {
                params:{
                    page: page,
                }
            });
            return res.data;
        } catch (e) {
            if(e.response.data){
                return rejectWithValue(e.response.data.message);
            }else{
                return rejectWithValue('Something went wrong');
            }
        }
    });

export const getCarsDetails = createAsyncThunk(
    'getCarsDetails',
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiClient('/cars/' + id);
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

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@config/axios';

export const postLogin = createAsyncThunk(
    'user/postLogin',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/auth/signin', payload);
            const data = res.data;
            return data;
        } catch (e) {
            console.log(e)
            if (e.response.data) {
                return rejectWithValue(e.response.data.message);
            } else {
                return rejectWithValue('Something went wrong');
            }
        }
    }
);

export const googleLogin = createAsyncThunk(
    'user/googleLogin',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/auth/googleSignIn', payload);
            const data = res.data;
            return data;
        } catch (e) {
            console.log(e)
            if (e.response.data) {
                return rejectWithValue(e.response.data.message);
            } else {
                return rejectWithValue('Something went wrong');
            }
        }
    }
);

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (token, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/auth/whoami', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = res.data;
            return data;
        } catch (e) {
            if (e.response.data) {
                return rejectWithValue(e.response.data.message);
            } else {
                return rejectWithValue('Something went wrong');
            }
        }
    }
)
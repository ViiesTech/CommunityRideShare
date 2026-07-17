import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthState {
    authToken: string | null;
    user: any | null;
    communityRole: 'member' | 'admin' | null;
    communityId: string | null;
}

const initialState: AuthState = {
    authToken: null,
    user: null,
    communityRole: null,
    communityId: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken: (state, action: PayloadAction<string>) => {
            state.authToken = action.payload;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setCommunityRole: (state, action: PayloadAction<'member' | 'admin' | null>) => {
            state.communityRole = action.payload;
        },
        removeAuthToken: state => {
            state.authToken = null;
            state.user = null;
            state.communityRole = null;
        },
        setCommunityId: (state, action: PayloadAction<string | null>) => {
            state.communityId = action.payload;
        }
    },
});

export const { setAuthToken, setUser, setCommunityRole, removeAuthToken, setCommunityId } = authSlice.actions;

export const selectAuthToken = (state: RootState): string | null =>
    state.auth.authToken;

export const selectCurrentUser = (state: RootState): any | null =>
    state.auth.user;

export const selectCommunityRole = (state: RootState): 'member' | 'admin' | null =>
    state.auth.communityRole;

export const selectCommunityId = (state: RootState): string | null =>
    state.auth.communityId;

export default authSlice.reducer;

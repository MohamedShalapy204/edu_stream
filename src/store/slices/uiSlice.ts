import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    theme: 'light' | 'dark';
}

const getStoredTheme = (): 'light' | 'dark' => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
};

const initialState: UIState = {
    theme: getStoredTheme(),
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
            document.documentElement.setAttribute('data-theme', action.payload);
        },
        toggleTheme: (state) => {
            const nextTheme = state.theme === 'light' ? 'dark' : 'light';
            state.theme = nextTheme;
            localStorage.setItem('theme', nextTheme);
            document.documentElement.setAttribute('data-theme', nextTheme);
        },
    },
});

export const { setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;

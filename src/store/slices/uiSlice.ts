import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import i18n from '@/lib/i18n';

interface UIState {
    theme: 'light' | 'dark';
    language: 'en' | 'ar';
}

const getStoredTheme = (): 'light' | 'dark' => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
};

const getStoredLanguage = (): 'en' | 'ar' => {
    const stored = localStorage.getItem('language');
    if (stored === 'en' || stored === 'ar') return stored;
    return 'ar';
};

const initialState: UIState = {
    theme: getStoredTheme(),
    language: getStoredLanguage(),
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
        setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
            document.documentElement.setAttribute('lang', action.payload);
            document.documentElement.setAttribute('dir', action.payload === 'ar' ? 'rtl' : 'ltr');
            i18n.changeLanguage(action.payload);
        },
        toggleLanguage: (state) => {
            const nextLang = state.language === 'en' ? 'ar' : 'en';
            state.language = nextLang;
            localStorage.setItem('language', nextLang);
            document.documentElement.setAttribute('lang', nextLang);
            document.documentElement.setAttribute('dir', nextLang === 'ar' ? 'rtl' : 'ltr');
            i18n.changeLanguage(nextLang);
        },
    },
});

export const { setTheme, toggleTheme, setLanguage, toggleLanguage } = uiSlice.actions;
export default uiSlice.reducer;

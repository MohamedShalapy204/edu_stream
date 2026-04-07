import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TheatreTab {
    id: string;
    title: string;
    type: "video" | "doc" | "instructions";
    url?: string;
    content?: string;
}

interface TheatreState {
    tabs: TheatreTab[];
    activeTabId: string | null;
    layout: "standard" | "cinema" | "reading";
    viewMode: "single" | "stacked";
}

const initialState: TheatreState = {
    tabs: [], // Now only holds document tabs
    activeTabId: null,
    layout: "standard",
    viewMode: "single",
};

const theatreSlice = createSlice({
    name: "theatre",
    initialState,
    reducers: {
        openTab: (state, action: PayloadAction<TheatreTab>) => {
            const exists = state.tabs.find((tab) => tab.id === action.payload.id);
            if (!exists) {
                state.tabs.push(action.payload);
            }
            state.activeTabId = action.payload.id;
        },
        closeTab: (state, action: PayloadAction<string>) => {
            state.tabs = state.tabs.filter((tab) => tab.id !== action.payload);
            if (state.activeTabId === action.payload) {
                state.activeTabId = state.tabs.length > 0 ? state.tabs[state.tabs.length - 1].id : null;
            }
        },
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTabId = action.payload;
        },
        setLayout: (state, action: PayloadAction<TheatreState["layout"]>) => {
            state.layout = action.payload;
        },
        setViewMode: (state, action: PayloadAction<TheatreState["viewMode"]>) => {
            state.viewMode = action.payload;
        },
        resetTheatre: (state) => {
            state.tabs = [];
            state.activeTabId = null;
            state.layout = "standard";
            state.viewMode = "single";
        },
    },
});

export const { openTab, closeTab, setActiveTab, setLayout, setViewMode, resetTheatre } = theatreSlice.actions;
export default theatreSlice.reducer;

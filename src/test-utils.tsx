import { type PropsWithChildren, type ReactElement } from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import { renderHook as rtlRenderHook, type RenderHookOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RootState, AppStore } from '@/store/store';
import uiReducer from '@/store/slices/uiSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
    initialEntries?: string[];
}

function buildStore(preloadedState?: Partial<RootState>, store?: AppStore) {
    return store ?? (configureStore({
        // @ts-expect-error - compatibility issue
        reducer: { ui: uiReducer },
        preloadedState
    }) as AppStore);
}

function buildQueryClient() {
    return new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
}

function Providers({
    children,
    store,
    queryClient,
    initialEntries = ['/'],
}: PropsWithChildren<{ store: AppStore; queryClient: QueryClient; initialEntries?: string[] }>): ReactElement {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>
                    {children}
                </MemoryRouter>
            </QueryClientProvider>
        </Provider>
    );
}

export function render(
    ui: ReactElement,
    {
        preloadedState,
        store,
        initialEntries,
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
    const testStore = buildStore(preloadedState, store);
    const queryClient = buildQueryClient();

    function Wrapper({ children }: PropsWithChildren): ReactElement {
        return (
            <Providers store={testStore} queryClient={queryClient} initialEntries={initialEntries}>
                {children}
            </Providers>
        );
    }

    return { store: testStore, queryClient, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}

type HookOptions<Props> = Omit<RenderHookOptions<Props>, 'queries' | 'wrapper'> & {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
    initialEntries?: string[];
};

export function renderHook<Result, Props>(
    renderCallback: (initialProps: Props) => Result,
    { preloadedState, store, initialEntries, ...renderOptions }: HookOptions<Props> = {},
) {
    const testStore = buildStore(preloadedState, store);
    const queryClient = buildQueryClient();

    function Wrapper({ children }: PropsWithChildren): ReactElement {
        return (
            <Providers store={testStore} queryClient={queryClient} initialEntries={initialEntries}>
                {children}
            </Providers>
        );
    }

    return {
        store: testStore,
        queryClient,
        ...rtlRenderHook(renderCallback, { wrapper: Wrapper, ...renderOptions }),
    };
}

export { screen, fireEvent, waitFor, act } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

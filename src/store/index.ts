import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import roleReducer from "./slices/role-slice";
import moduleReducer from "./slices/module-slice";

const rootReducer = combineReducers({
    role: roleReducer,
    module: moduleReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const Reducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: Reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

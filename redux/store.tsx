import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import depositMethodReducer from "./depositMethodSlice";
import { apiSlice } from "./features/api/apiSlice";
import authReducer from "./features/auth/authSlice";
import fruitLoopsReducer from "./features/fruit-loops/fruitLoopsSlice";
import luckyTimeReducer from "./features/lucky-time/luckyTimeSlice";
import luckyWheelReducer from "./features/lucky-wheel/luckyWheelSlice";
import miningReducer from "./features/mining/miningSlice";
import tradeReducer from "./features/trade/tradeSlice";
import sidebarReducer from "./features/ui/sidebarSlice";
import resetPassSlice from "./resetPassSlice";
import signUpData from "./signupDataSlice";
import stepperSlice from "./stepperSlice";
import verificationSlice from "./verificationSlice";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth", "trade", "resetPass"],
};

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  mining: miningReducer,
  depositMethod: depositMethodReducer,
  signUpData,
  stepper: stepperSlice,
  resetPass: resetPassSlice,
  verification: verificationSlice,
  trade: tradeReducer,
  sidebar: sidebarReducer,
  luckyWheel: luckyWheelReducer,
  fruitLoops: fruitLoopsReducer,
  luckyTime: luckyTimeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware);
  },
});
export let persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

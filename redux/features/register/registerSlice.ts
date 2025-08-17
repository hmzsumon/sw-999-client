import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type Touched = Record<string, boolean>;
type Errors = Record<string, string | null>;

export interface RegisterState {
  phone: string;
  password: string;
  confirmPassword: string;
  captcha: string;
  agree: boolean;
  promoOptIn: boolean;
  touched: Touched;
  errors: Errors;
  loading: boolean;
  successMsg?: string;
  errorMsg?: string;
}

const initialState: RegisterState = {
  phone: "",
  password: "",
  confirmPassword: "",
  captcha: "",
  agree: false,
  promoOptIn: false,
  touched: {},
  errors: {},
  loading: false,
  successMsg: undefined,
  errorMsg: undefined,
};

function sanitizePhone(v: string) {
  return v.replace(/[()\s-]/g, "");
}

function computeErrors(s: RegisterState): Errors {
  const errs: Errors = {
    phone: null,
    password: null,
    confirmPassword: null,
    captcha: null,
    agree: null,
  };

  const phone = sanitizePhone(s.phone);
  if (!phone) {
    errs.phone = "Phone is required.";
  } else if (!/^\+?\d{10,14}$/.test(phone)) {
    errs.phone = "Enter a valid phone number (10–14 digits).";
  }

  if (!s.password) {
    errs.password = "Password is required.";
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(s.password)) {
    errs.password = "Min 6 chars with letters and numbers.";
  }

  if (!s.confirmPassword) {
    errs.confirmPassword = "Please confirm your password.";
  } else if (s.confirmPassword !== s.password) {
    errs.confirmPassword = "Passwords do not match.";
  }

  if (!s.captcha) {
    errs.captcha = "Captcha is required.";
  } else if (s.captcha.trim() !== "22277") {
    errs.captcha = "Captcha does not match.";
  }

  if (!s.agree) {
    errs.agree = "You must accept the terms.";
  }

  return errs;
}

export const submitRegister = createAsyncThunk<
  string,
  void,
  { state: { register: RegisterState }; rejectValue: string }
>("register/submit", async (_, thunkApi) => {
  const state = thunkApi.getState().register;
  const errs = computeErrors(state);
  const invalid = Object.values(errs).some((e) => e);
  if (invalid) {
    return thunkApi.rejectWithValue("Please fix the highlighted errors.");
  }
  await new Promise((r) => setTimeout(r, 1000));
  const phoneRaw = state.phone.trim();
  if (phoneRaw === "+999") {
    return thunkApi.rejectWithValue("Registration failed. Try again.");
  }
  return "Registration successful!";
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setField(
      state,
      action: PayloadAction<{
        key:
          | "phone"
          | "password"
          | "confirmPassword"
          | "captcha"
          | "agree"
          | "promoOptIn";
        value: any;
      }>
    ) {
      // @ts-expect-error dynamic
      state[action.payload.key] = action.payload.value;
    },
    setTouched(state, action: PayloadAction<string>) {
      state.touched[action.payload] = true;
    },
    validateForm(state) {
      state.errors = computeErrors(state);
    },
    clearStatus(state) {
      state.successMsg = undefined;
      state.errorMsg = undefined;
    },
    resetForm() {
      return { ...initialState };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(submitRegister.pending, (state) => {
        state.loading = true;
        state.successMsg = undefined;
        state.errorMsg = undefined;
      })
      .addCase(submitRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
        Object.assign(state, initialState);
        state.successMsg = action.payload;
      })
      .addCase(submitRegister.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload || "Something went wrong.";
      });
  },
});

export const { setField, setTouched, validateForm, clearStatus, resetForm } =
  registerSlice.actions;

export default registerSlice.reducer;

export const selectRegister = (state: any) =>
  (state.register as RegisterState) || initialState;

export const selectIsValid = (state: any) => {
  const s = state.register as RegisterState;
  const errs = computeErrors(s);
  const hasErrors = Object.values(errs).some((e) => e);
  const requiredFilled =
    !!s.phone && !!s.password && !!s.confirmPassword && !!s.captcha && s.agree;
  return requiredFilled && !hasErrors && !s.loading;
};

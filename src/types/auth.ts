export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password1: string;
    password2: string;
}

// export interface RegisterResponse {
//   message: string;
// }

export interface OTPFormState {
  otpCode: string;
}

export interface OTPRequest {
  token: string;
  otp_code: string;
}

export interface ResendOTPRequest {
  token: string | null;
}

interface AuthResponse {
    access: string;
    user: {
        first_name: string;
        last_name: string;
    };
}
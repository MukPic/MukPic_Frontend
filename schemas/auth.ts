import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
});

export const userSchema = z.object({
  userId: z
    .string()
    .min(4, { message: "User ID must be at least 4 characters." })
    .max(20, { message: "User ID must be at most 20 characters." })
    .refine((val) => !/^\d/.test(val), {
      message: "User ID cannot start with a number.",
    })
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "User ID must contain at least one letter.",
    })
    .refine((val) => /^[a-zA-Z0-9]+$/.test(val), {
      message: "User ID can only contain letters and numbers.",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(20, { message: "Password must be at most 20 characters." })
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Password must contain at least one letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number.",
    })
    // Temporarily disallow special characters
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
});

export const userNameSchema = z.object({
  userName: z
    .string()
    .min(2, { message: "User name must be at least 2 characters." })
    .max(12, { message: "User name must be at most 12 characters." })
    .refine((val) => !/^\d/.test(val), {
      message: "User name cannot start with a number.",
    })
    .refine((val) => /^[a-zA-Z0-9가-힣]+$/.test(val), {
      // 숫자 포함 허용
      message:
        "User name can only contain letters, numbers, or Korean characters.",
    })
    .refine((val) => /[a-zA-Z가-힣]/.test(val), {
      // 숫자만 허용하지 않음
      message: "User name cannot be composed of numbers only.",
    }),
});

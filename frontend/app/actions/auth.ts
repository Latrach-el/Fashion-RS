"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login( formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Please fill in all fields"
    };
  }

  try {
    // const response = await fetch("http://localhost:5000/api/auth/login", {
    //   method: "POST",
    //   body: JSON.stringify({ email, password }),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });

    // const data = await response.json();

    // if (!response.ok) {
    //   return {
    //     error: data.message || "Login failed"
    //   };
    // }

    // Set session cookie
    // cookies().set("session", data.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24 * 7 // 1 week
    // });

    revalidatePath("/");
    redirect("/dashboard");
  } catch (error) {
    return {
      error: "An error occurred during login"
    };
  }
}

export async function register(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return {
      error: "Please fill in all fields"
    };
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Registration failed"
      };
    }

    // Automatically log in the user after successful registration
    cookies().set("session", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7
    });

    revalidatePath("/");
    redirect("/dashboard");
  } catch (error) {
    return {
      error: "An error occurred during registration"
    };
  }
}

export async function loginWithProvider(provider: "google" | "github") {
  "use server";

  try {
    const response = await fetch(`/api/auth/${provider}`, {
      method: "POST"
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || `${provider} login failed`
      };
    }

    cookies().set("session", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7
    });

    revalidatePath("/");
    redirect("/dashboard");
  } catch (error) {
    return {
      error: `An error occurred during ${provider} login`
    };
  }
}

export async function logout() {
  "use server";

  cookies().delete("session");
  revalidatePath("/");
  redirect("/login");
}

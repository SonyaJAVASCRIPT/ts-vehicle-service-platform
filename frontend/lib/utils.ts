import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { userService, vehicleService } from "../hooks/env";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrentUser = async (link: string) => {
  try {
    const res = await fetch(`${link}/user/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Не авторизован");
    }

    const user: { sub: string; username: string } = await res.json();
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// store/useAppStore.ts
// This is a Zustand store for managing global state in the application
import { create } from "zustand"; //import the zustand library npm install zustand

interface AppState {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const User = create<AppState>((set) => ({
  name: "victech", // default global value
  email: "vick@gmail.com", // default global value
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
}));
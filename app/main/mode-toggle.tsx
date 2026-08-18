"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Sun,
  Moon,
  // Laptop
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <Button
        variant="ghost"
        className="rounded-full w-10"
        aria-label="Toggle Theme"
      >
        <div className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="rounded-full w-10"
      aria-label="Toggle Theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>

    // <button
    //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    //   className="rounded p-2 hover:bg-muted transition-colors"
    // >
    //   {theme === "dark" ? "🌞" : "🌙"}
    // </button>

    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="ghost" size="sm" className="size-8 px-0">
    //       <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       <Sun className="mr-2 size-4" />
    //       <span>Light</span>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       <Moon className="mr-2 size-4" />
    //       <span>Dark</span>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       <Laptop className="mr-2 size-4" />
    //       <span>System</span>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}

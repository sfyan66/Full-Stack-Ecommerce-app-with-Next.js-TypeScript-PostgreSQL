"use client";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          >
            {theme === "system" ? (
              <SunMoon />
            ) : theme === "light" ? (
              <SunIcon />
            ) : (
              <MoonIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Appearence</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["system", "light", "dark"].map((item) => (
            <DropdownMenuCheckboxItem
              key={item}
              checked={theme === item}
              onClick={() => setTheme(item)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeToggle;

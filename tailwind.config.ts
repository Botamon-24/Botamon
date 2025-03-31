import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 蓝色监狱主题色 - 扩展更多颜色变体
        "bl-blue": {
          DEFAULT: "#1353c9", // 主蓝色
          light: "#2a72e5",   // 亮蓝色
          lighter: "#3e86ff", // 更亮的蓝色
          dark: "#0a296e",    // 暗蓝色
          darker: "#051845",  // 更暗的蓝色
          accent: "#00c3ff",  // 亮蓝色强调
          vivid: "#01a9f4",   // 鲜艳蓝色
        },
        "bl-dark": {
          DEFAULT: "#050a18", // 暗黑背景
          light: "#0c142a",   // 稍亮的深色
          lighter: "#131c3a", // 更亮的深色
        },
        "bl-light": {
          DEFAULT: "#f0f2ff", // 浅亮色
          dark: "#e0e5fc",    // 稍深的浅色
        },
        "bl-accent": {
          cyan: "#29d2ff",    // 青色强调
          purple: "#c741ff",  // 紫色强调 - 监狱制服上的颜色
          gold: "#ffcf3c",    // 金色强调
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow": {
          "0%, 100%": {
            textShadow: "0 0 12px rgba(0, 195, 255, 0.5), 0 0 20px rgba(0, 195, 255, 0.3)"
          },
          "50%": {
            textShadow: "0 0 16px rgba(0, 195, 255, 0.8), 0 0 30px rgba(0, 195, 255, 0.5)"
          },
        },
        "pulse-blue": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(19, 83, 201, 0.7)"
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(19, 83, 201, 0)"
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow": "glow 3s ease-in-out infinite",
        "pulse-blue": "pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "prison-gradient": "linear-gradient(to bottom, #050a18, #0a296e)",
        "blue-mesh": "url('/blue-mesh-pattern.svg')",
        "blue-grid": "url('/grid-pattern.svg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

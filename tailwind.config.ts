import type { Config } from "tailwindcss";

/**
 * Palette et échelles volontairement courtes : tout ce qui n'est pas listé ici
 * n'a pas sa place dans le design. Les valeurs vivent dans app/globals.css
 * pour rester lisibles depuis les DevTools.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-sunk": "var(--paper-sunk)",
        "paper-edge": "var(--paper-edge)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        rule: "var(--rule)",
        "rule-strong": "var(--rule-strong)",
        signal: "var(--signal)",
        "signal-deep": "var(--signal-deep)",
        pit: "var(--pit)",
        "pit-2": "var(--pit-2)",
        "pit-ink": "var(--pit-ink)",
        "pit-ink-2": "var(--pit-ink-2)",
        "pit-rule": "var(--pit-rule)",
        danger: "var(--danger)",
        ok: "var(--ok)",
      },
      fontFamily: {
        sans: ['"Archivo"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Martian Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "var(--page-max)",
      },
      spacing: {
        rail: "var(--rail)",
        pad: "var(--page-pad)",
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};

export default config;

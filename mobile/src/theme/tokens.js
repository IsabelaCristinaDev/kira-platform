// Tokens de design do app: mesmos valores de src/shared/styles/tokens.css, em formato React Native · API: nenhuma
const hsl = (value) => `hsl(${value})`;

export const colors = {
  white: "#ffffff",
  background: "hsl(0, 0%, 100%)",
  foreground: hsl("280, 20%, 15%"),
  card: "hsl(0, 0%, 100%)",
  primary: hsl("340, 70%, 55%"),
  primaryText: hsl("340, 70%, 47%"),
  destructiveText: hsl("0, 84%, 46%"),
  primaryForeground: hsl("40, 80%, 92%"),
  secondary: hsl("280, 40%, 50%"),
  accent: hsl("15, 80%, 60%"),
  muted: hsl("340, 20%, 96%"),
  mutedForeground: hsl("280, 10%, 45%"),
  border: hsl("340, 20%, 90%"),
  destructive: hsl("0, 84%, 60%"),
  primaryTint: hsl("340, 55%, 88%"),
  surfaceSoft: hsl("340, 30%, 96%"),
  violet: hsl("270, 60%, 55%"),
  lilac: hsl("270, 25%, 95%"),
  page: "#efeff1",
  // transparências dos canais, iguais a hsl(var(--x-hsl) / alpha) da web
  primary10: "hsla(340, 70%, 55%, 0.1)",
  primary12: "hsla(340, 70%, 55%, 0.12)",
  accent14: "hsla(15, 80%, 60%, 0.14)",
  destructive10: "hsla(0, 84%, 60%, 0.1)",
};

// gradiente da marca: laranja, rosa, lilás a 135 graus
export const gradientKira = {
  colors: [colors.accent, colors.primary, colors.violet],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

export const space = (n) => n;

export const radius = {
  xs: 6,
  sm: 8,
  icon: 9,
  md: 10,
  lg: 12,
  xl: 14,
  "2xl": 16,
  "3xl": 18,
  "4xl": 20,
  sheet: 24,
  pill: 999,
  round: 999,
};

export const fontSize = { xs: 12, sm: 13, md: 14, base: 16, lg: 18, xl: 20, "2xl": 22, "3xl": 28, "4xl": 32 };

export const fonts = {
  display: "PlayfairDisplay_700Bold",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodySemi: "DMSans_600SemiBold",
  bodyBold: "DMSans_700Bold",
};

// sombra do cartão em destaque (shadow-card-glow)
export const shadowGlow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 14,
  elevation: 4,
};

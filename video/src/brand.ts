import { loadFont } from "@remotion/google-fonts/Poppins";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});

export const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  accent: "#FFE600",
  muted: "#8A8A8A",
};

// Area yang tertutup UI TikTok; teks jangan masuk ke sini.
export const SAFE = { top: 150, bottom: 420, right: 140 };

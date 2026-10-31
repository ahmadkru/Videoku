import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";

// Satu "halaman" caption: 2–3 kata. Waktu dalam ms relatif ke awal scene.
// Kata dalam `highlight` diwarnai kuning.
export type CaptionPage = {
  text: string;
  startMs: number;
  endMs: number;
  highlight?: string[];
};

export const Captions: React.FC<{ pages: CaptionPage[] }> = ({ pages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs);
  if (!page) {
    return null;
  }

  const pageFrame = frame - (page.startMs / 1000) * fps;
  const scale = interpolate(pageFrame, [0, 4], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 1340,
        left: 60,
        right: 140,
        textAlign: "center",
        fontFamily,
        fontWeight: 800,
        fontSize: 68,
        lineHeight: 1.1,
        textTransform: "uppercase",
        color: COLORS.white,
        textShadow: "0 5px 0 rgba(0,0,0,0.65), 0 0 18px rgba(0,0,0,0.5)",
        scale: String(scale),
      }}
    >
      {page.text.split(" ").map((word, i) => {
        const clean = word.replace(/[.,!?]/g, "").toLowerCase();
        const hl = page.highlight?.some((h) => h.toLowerCase() === clean);
        return (
          <span key={i} style={{ color: hl ? COLORS.accent : undefined }}>
            {word}{" "}
          </span>
        );
      })}
    </div>
  );
};

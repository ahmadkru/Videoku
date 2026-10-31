import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../brand";

// Judul besar + subjudul, gaya "Meet Robert" di referensi.
export const TitleOverlay: React.FC<{
  title: string;
  subtitle?: string;
  top?: number;
  outAt?: number;
  size?: number;
}> = ({ title, subtitle, top = 620, outAt, size = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const exit =
    outAt === undefined
      ? 0
      : interpolate(frame, [outAt, outAt + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 140,
        textAlign: "center",
        fontFamily,
        color: COLORS.white,
        textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        opacity: enter * (1 - exit),
        translate: `0 ${(1 - enter) * 40}px`,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: size, lineHeight: 1.05 }}>{title}</div>
      {subtitle ? (
        <div style={{ fontWeight: 500, fontSize: 44, marginTop: 14 }}>{subtitle}</div>
      ) : null}
    </div>
  );
};

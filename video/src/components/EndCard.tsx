import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../brand";

export const EndCard: React.FC<{ cta: string; handle: string }> = ({ cta, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const ctaOpacity = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        color: COLORS.white,
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{ width: 640, scale: String(interpolate(pop, [0, 1], [0.8, 1])), opacity: pop }}
      />
      <div style={{ opacity: ctaOpacity, textAlign: "center", marginTop: 40 }}>
        <div style={{ fontWeight: 800, fontSize: 64 }}>{cta}</div>
        <div style={{ fontWeight: 500, fontSize: 44, color: COLORS.accent, marginTop: 12 }}>
          {handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

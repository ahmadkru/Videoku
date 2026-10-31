import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../brand";

type Props = {
  src: string | null;
  label: string;
  trimBefore?: number;
  muted?: boolean;
  // Punch-in mendadak (cut-zoom) di frame ini, relatif ke awal scene.
  punchInAt?: number;
  // Zoom pelan sepanjang scene: skala akhir.
  pushTo?: number;
};

export const Footage: React.FC<Props> = ({
  src,
  label,
  trimBefore = 0,
  muted = false,
  punchInAt,
  pushTo = 1.06,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const push = interpolate(frame, [0, durationInFrames], [1, pushTo], {
    extrapolateRight: "clamp",
  });
  const punch = punchInAt !== undefined && frame >= punchInAt ? 1.15 : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.black }}>
      <AbsoluteFill style={{ scale: String(push * punch) }}>
        {src ? (
          <Video
            src={staticFile(src)}
            trimBefore={trimBefore}
            muted={muted}
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              background: "repeating-linear-gradient(45deg, #1b1b1b 0 40px, #232323 40px 80px)",
              color: COLORS.muted,
              fontFamily,
              fontWeight: 700,
              fontSize: 48,
              textAlign: "center",
            }}
          >
            {`FOOTAGE\n${label}`.split("\n").map((l) => (
              <div key={l}>{l}</div>
            ))}
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../brand";

const FRAMES_PER_WORD = 4;

export const QuestionCard: React.FC<{ question: string }> = ({ question }) => {
  const frame = useCurrentFrame();
  const words = question.split(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.25,
          textAlign: "center",
          color: COLORS.black,
        }}
      >
        {words.map((word, i) => {
          const start = 8 + i * FRAMES_PER_WORD;
          const opacity = interpolate(frame, [start, start + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(frame, [start, start + 5], [12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={i}
              style={{ opacity, display: "inline-block", translate: `0 ${y}px` }}
            >
              {word}&nbsp;
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

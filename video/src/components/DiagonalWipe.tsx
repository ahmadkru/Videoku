import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../brand";

type WipeProps = { first: string; second: string };

// Dua lapis panel diagonal menyapu dari kiri-bawah ke kanan-atas,
// seperti transisi di video referensi. Scene baru muncul setelah panel menutup layar.
const DiagonalWipeComponent: React.FC<
  TransitionPresentationComponentProps<WipeProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const p = presentationProgress;
  const panel = (start: number, end: number, color: string) => {
    const t = interpolate(p, [start, end], [-1, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          backgroundColor: color,
          // Panel diputar 45°, lalu digeser sepanjang sumbu Y lokalnya
          // (= arah kiri-bawah ↔ kanan-atas di layar).
          width: "300%",
          height: "300%",
          left: "-100%",
          top: "-100%",
          transform: `rotate(45deg) translateY(${-t * 100}%)`,
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: p >= 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>
      {panel(0, 0.6, passedProps.first)}
      {panel(0.15, 0.85, passedProps.second)}
    </AbsoluteFill>
  );
};

export const diagonalWipe = (
  props: WipeProps = { first: COLORS.white, second: COLORS.black },
): TransitionPresentation<WipeProps> => ({
  component: DiagonalWipeComponent,
  props,
});

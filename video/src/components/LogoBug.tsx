import { Img, staticFile } from "remotion";
import { SAFE } from "../brand";

export const LogoBug: React.FC = () => {
  return (
    <Img
      src={staticFile("logo.png")}
      style={{
        position: "absolute",
        top: SAFE.top - 40,
        right: 48,
        width: 140,
        opacity: 0.75,
        mixBlendMode: "screen",
      }}
    />
  );
};

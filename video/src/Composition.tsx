import { Composition } from "remotion";
import { Testimoni } from "./Testimoni";

export const MyComposition = () => {
  return (
    <Composition
      id="Testimoni"
      component={Testimoni}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

import { Sequence } from "remotion";
import { Captions, type CaptionPage } from "./Captions";
import { Footage } from "./Footage";

// Satu potongan (jump cut) dari footage testimoni, dengan caption-nya sendiri.
// `zoom` true = punch-in 115% (dipakai selang-seling antar potongan).
export const Clip: React.FC<{
  name: string;
  src: string | null;
  from: number;
  durationInFrames: number;
  trimBefore: number;
  zoom?: boolean;
  captions: CaptionPage[];
}> = ({ name, src, from, durationInFrames, trimBefore, zoom = false, captions }) => {
  return (
    <Sequence name={name} from={from} durationInFrames={durationInFrames}>
      <Footage
        src={src}
        label={name}
        trimBefore={trimBefore}
        punchInAt={zoom ? 0 : undefined}
        pushTo={1.04}
      />
      <Captions pages={captions} trimBefore={trimBefore} />
    </Sequence>
  );
};

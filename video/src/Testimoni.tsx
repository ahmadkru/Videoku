import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { diagonalWipe } from "./components/DiagonalWipe";
import { EndCard } from "./components/EndCard";
import { Footage } from "./components/Footage";
import { LogoBug } from "./components/LogoBug";
import { QuestionCard } from "./components/QuestionCard";
import { TitleOverlay } from "./components/TitleOverlay";
import { FOOTAGE } from "./footage";

// Durasi total: 945 frame scene − 3 × 15 frame transisi = 900 frame (30 dtk).
// Caption ([]) diisi dari transkripsi suara peserta setelah footage tersedia;
// trimBefore tiap scene disesuaikan ke momen terbaik di footage.
export const Testimoni: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Testimoni">
        <TransitionSeries.Sequence name="Hook" durationInFrames={2 * fps}>
          <Footage src={FOOTAGE.broll1} label="B-ROLL 1 · HOOK" muted pushTo={1.12} />
          <TitleOverlay title="Apa kata peserta kami?" top={720} size={104} />
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Perkenalan" durationInFrames={6 * fps}>
          <Footage
            src={FOOTAGE.main}
            label="UTAMA · PERKENALAN"
            trimBefore={0}
            punchInAt={3 * fps}
          />
          <TitleOverlay
            title="Testimoni Peserta"
            subtitle="ASDTUG Handling"
            top={560}
            outAt={Math.round(2.7 * fps)}
          />
          <Captions pages={[]} />
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={diagonalWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence name="Pertanyaan 1" durationInFrames={2 * fps}>
          <QuestionCard question="Apa yang paling berkesan selama pelatihan?" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Jawaban 1" durationInFrames={8 * fps}>
          <Footage
            src={FOOTAGE.main}
            label="UTAMA · JAWABAN 1"
            trimBefore={6 * fps}
            punchInAt={Math.round(2.3 * fps)}
          />
          <Sequence name="Cutaway B-roll 2" from={5 * fps} durationInFrames={Math.round(1.5 * fps)}>
            <Footage src={FOOTAGE.broll2} label="B-ROLL 2" muted pushTo={1.1} />
          </Sequence>
          <Captions pages={[]} />
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={diagonalWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence name="Pertanyaan 2" durationInFrames={2 * fps}>
          <QuestionCard question="Kenapa kamu merekomendasikan ASDTUG Handling?" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Jawaban 2" durationInFrames={8 * fps}>
          <Footage
            src={FOOTAGE.main}
            label="UTAMA · JAWABAN 2"
            trimBefore={14 * fps}
            punchInAt={Math.round(1.5 * fps)}
            pushTo={1.1}
          />
          <Sequence name="Cutaway B-roll 3" from={3 * fps} durationInFrames={Math.round(1.5 * fps)}>
            <Footage src={FOOTAGE.broll3} label="B-ROLL 3" muted pushTo={1.1} />
          </Sequence>
          <Sequence name="Cutaway B-roll 4" from={6 * fps} durationInFrames={fps}>
            <Footage src={FOOTAGE.broll4} label="B-ROLL 4" muted pushTo={1.1} />
          </Sequence>
          <Captions pages={[]} />
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={diagonalWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence name="Penutup" durationInFrames={Math.round(3.5 * fps)}>
          <EndCard cta="Ikuti untuk info pelatihan berikutnya" handle="@asdtughandling" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Sequence } from "remotion";
import { Clip } from "./components/Clip";
import { diagonalWipe } from "./components/DiagonalWipe";
import { EndCard } from "./components/EndCard";
import { LogoBug } from "./components/LogoBug";
import { QuestionCard } from "./components/QuestionCard";
import { TitleOverlay } from "./components/TitleOverlay";
import { FOOTAGE } from "./footage";

// Durasi total: 945 frame scene − 3 × 15 frame transisi = 900 frame (30 dtk).
// trimBefore = frame di footage asli (30fps). Waktu caption = ms di footage asli,
// dari transkripsi Whisper lalu dirapikan.
export const Testimoni: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Testimoni">
        <TransitionSeries.Sequence name="Pembuka" durationInFrames={187}>
          <Clip
            name="Alhamdulillah"
            src={FOOTAGE.main}
            from={0}
            durationInFrames={33}
            trimBefore={254}
            zoom
            captions={[{ text: "Alhamdulillah,", startMs: 8450, endMs: 9600, highlight: ["alhamdulillah"] }]}
          />
          <Clip
            name="Lancar"
            src={FOOTAGE.main}
            from={33}
            durationInFrames={51}
            trimBefore={303}
            captions={[
              { text: "pelaksanaannya", startMs: 10100, endMs: 10850 },
              { text: "lancar", startMs: 10850, endMs: 11850, highlight: ["lancar"] },
            ]}
          />
          <Clip
            name="Walaupun banyak"
            src={FOOTAGE.main}
            from={84}
            durationInFrames={32}
            trimBefore={354}
            zoom
            captions={[{ text: "walaupun banyak", startMs: 11750, endMs: 12900 }]}
          />
          <Clip
            name="Belajar lagi"
            src={FOOTAGE.main}
            from={116}
            durationInFrames={71}
            trimBefore={462}
            captions={[{ text: "belajar lagi.", startMs: 15350, endMs: 17800, highlight: ["belajar"] }]}
          />
          <Sequence name="Hook teks" durationInFrames={84}>
            <TitleOverlay title="Apa kata peserta training kami?" top={300} size={88} />
          </Sequence>
          <Sequence name="Judul" from={84} durationInFrames={103}>
            <TitleOverlay
              title="Testimoni Peserta"
              subtitle="Training Basic ASD Tug Handling"
              top={300}
              outAt={90}
            />
          </Sequence>
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={diagonalWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence name="Pertanyaan 1" durationInFrames={60}>
          <QuestionCard question="Bagaimana pengalaman training-nya?" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Jawaban 1" durationInFrames={247}>
          <Clip
            name="Selama saya pembelajaran"
            src={FOOTAGE.main}
            from={0}
            durationInFrames={68}
            trimBefore={557}
            captions={[
              { text: "Selama saya", startMs: 18500, endMs: 19310 },
              { text: "pembelajaran", startMs: 19310, endMs: 20850, highlight: ["pembelajaran"] },
            ]}
          />
          <Clip
            name="Teori online 3 bulan"
            src={FOOTAGE.main}
            from={68}
            durationInFrames={119}
            trimBefore={645}
            zoom
            captions={[
              { text: "dari awal", startMs: 21450, endMs: 23090 },
              { text: "teori online", startMs: 23090, endMs: 24030, highlight: ["teori", "online"] },
              { text: "selama 3 bulan", startMs: 24030, endMs: 25500, highlight: ["3", "bulan"] },
            ]}
          />
          <Clip
            name="Saya berlayar"
            src={FOOTAGE.main}
            from={187}
            durationInFrames={60}
            trimBefore={810}
            captions={[{ text: "saya berlayar.", startMs: 26950, endMs: 29050, highlight: ["berlayar"] }]}
          />
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={diagonalWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence name="Pertanyaan 2" durationInFrames={60}>
          <QuestionCard question="Apa pesan untuk Capt. Alif?" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence name="Jawaban 2" durationInFrames={296}>
          <Clip
            name="Dan"
            src={FOOTAGE.main}
            from={0}
            durationInFrames={24}
            trimBefore={1223}
            zoom
            captions={[{ text: "Dan", startMs: 40750, endMs: 41600 }]}
          />
          <Clip
            name="Terima kasih Capt. Alif"
            src={FOOTAGE.main}
            from={24}
            durationInFrames={81}
            trimBefore={1266}
            captions={[
              { text: "Capt. Alif,", startMs: 42150, endMs: 42890, highlight: ["alif"] },
              { text: "terima kasih", startMs: 42890, endMs: 43750 },
              { text: "banyak bantuannya", startMs: 43750, endMs: 44950, highlight: ["banyak"] },
            ]}
          />
          <Clip
            name="Sampai hari ini"
            src={FOOTAGE.main}
            from={105}
            durationInFrames={117}
            trimBefore={1376}
            zoom
            captions={[
              { text: "selama pelajaran", startMs: 45800, endMs: 46870 },
              { text: "dari awal teori", startMs: 46870, endMs: 48070, highlight: ["teori"] },
              { text: "sampai hari ini.", startMs: 48070, endMs: 49800, highlight: ["hari", "ini"] },
            ]}
          />
          <Clip
            name="Penutup salam"
            src={FOOTAGE.main}
            from={222}
            durationInFrames={74}
            trimBefore={1842}
            captions={[
              { text: "Terima kasih.", startMs: 61350, endMs: 62500, highlight: ["terima", "kasih"] },
              { text: "Assalamualaikum", startMs: 62500, endMs: 63090 },
              { text: "warahmatullahi wabarakatuh.", startMs: 63090, endMs: 63900 },
            ]}
          />
          <LogoBug />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={diagonalWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence name="Penutup" durationInFrames={95}>
          <EndCard cta="Ikuti untuk info training berikutnya" handle="@asdtug.handling" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

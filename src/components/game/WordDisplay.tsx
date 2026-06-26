type WordDisplayProps = {
  segments: string[][];
};

export function WordDisplay({ segments }: WordDisplayProps) {
  return (
    <div
      className="flex flex-wrap items-end justify-center gap-x-6 gap-y-8"
      aria-label="Word progress"
    >
      {segments.map((segment, segmentIndex) => (
        <div key={segmentIndex} className="flex gap-2 sm:gap-2.5">
          {segment.map((letter, index) => (
            <span
              key={`${segmentIndex}-${index}`}
              className="inline-flex h-11 w-8 items-end justify-center border-b-2 border-foreground/80 pb-1 font-mono text-xl font-medium tracking-wide sm:h-12 sm:w-9 sm:text-2xl"
            >
              {letter ? letter : <span className="text-foreground/25">·</span>}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

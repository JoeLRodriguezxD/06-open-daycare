import { feedHeader } from "@/lib/feed-mock";

export function FeedHeader() {
  return (
    <div className="mb-6">
      <div className="text-accent-deep mb-1 text-[12.5px] font-extrabold tracking-[0.8px]">
        {feedHeader.eyebrow}
      </div>
      <h1 className="font-display text-foreground m-0 text-[30px] font-semibold">
        {feedHeader.title}
      </h1>
      <p className="text-secondary mt-[5px] mb-0 text-[14.5px]">
        {feedHeader.subtitle}
      </p>
    </div>
  );
}

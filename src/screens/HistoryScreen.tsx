import { FeaturePlaceholder } from "../components/FeaturePlaceholder";
import { ScreenHeader } from "../components/ScreenHeader";

type HistoryScreenProps = {
  onTrack: () => void;
  onSignOut: () => void;
};

export function HistoryScreen({ onTrack, onSignOut }: HistoryScreenProps) {
  return (
    <>
      <ScreenHeader
        eyebrow="YOUR EXPERIENCES, IN ONE PLACE"
        title="Your health history"
        onSignOut={onSignOut}
      />
      <FeaturePlaceholder
        icon="◷"
        title="Your health history"
        description="Check-ins you choose to record will appear here, ready for you to review over time."
        action="Log your first check-in"
        onAction={onTrack}
      />
    </>
  );
}

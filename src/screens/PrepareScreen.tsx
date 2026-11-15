import { FeaturePlaceholder } from "../components/FeaturePlaceholder";
import { ScreenHeader } from "../components/ScreenHeader";

type PrepareScreenProps = {
  onTrack: () => void;
  onSignOut: () => void;
};

export function PrepareScreen({ onTrack, onSignOut }: PrepareScreenProps) {
  return (
    <>
      <ScreenHeader
        eyebrow="YOUR VOICE BELONGS IN THE CONVERSATION"
        title="Appointment prep"
        onSignOut={onSignOut}
      />
      <FeaturePlaceholder
        icon="♡"
        title="Appointment prep"
        description="Keep questions and concerns together so you can prepare for a conversation with your care team."
        action="Start with a check-in"
        onAction={onTrack}
      />
    </>
  );
}

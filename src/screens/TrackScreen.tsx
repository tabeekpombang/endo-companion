import { FeaturePlaceholder } from "../components/FeaturePlaceholder";
import { ScreenHeader } from "../components/ScreenHeader";

type TrackScreenProps = {
  onSignOut: () => void;
};

export function TrackScreen({ onSignOut }: TrackScreenProps) {
  return (
    <>
      <ScreenHeader
        eyebrow="YOUR PRIVATE SPACE"
        title="How are you feeling?"
        onSignOut={onSignOut}
      />
      <FeaturePlaceholder
        icon="+"
        title="How are you feeling?"
        description="The symptom check-in will be added in the next step. This is where you’ll record pain, symptoms, and how your day is going."
      />
    </>
  );
}

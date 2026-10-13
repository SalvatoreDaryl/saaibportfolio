import DestinationPlaceholder from './DestinationPlaceholder.jsx';
import NightCity from './NightCity.jsx';

/* Isolated on purpose: replace this component with the real night-city map in the next phase. */
export default function MapPlaceholder({ onBack }) {
  return (
    <div className="mapph">
      <NightCity className="mapph__city" />
      <svg className="mapph__route" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <polyline points="80,250 380,250 380,120 760,120 760,200 1180,200 1180,70" fill="none" stroke="#E52432" strokeWidth="5" strokeDasharray="22 12" />
        <polygon points="1166,84 1180,56 1194,84" fill="#E52432" />
      </svg>
      <DestinationPlaceholder
        kicker="CITY MAP // NEXT PHASE"
        title="THE CITY IS NOT BUILT YET"
        body="This placeholder marks where the night-city map will go: districts for projects, profile, skills, testimonials, contact, and experiments, connected by red routes."
        onBack={onBack}
        backLabel="RETURN TO TITLE"
      />
    </div>
  );
}

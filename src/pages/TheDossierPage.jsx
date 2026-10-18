import DistrictPage from './DistrictPage.jsx';
import { districtById } from '../data/districts.js';

export default function TheDossierPage({ onBack }) {
  return <DistrictPage district={districtById('dossier')} onBack={onBack} status="PROFILE // UNDER CONSTRUCTION" message="The character file is being written: background, interests, goals, and the developer profile." />;
}

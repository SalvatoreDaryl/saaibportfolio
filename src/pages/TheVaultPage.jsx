import DistrictPage from './DistrictPage.jsx';
import { districtById } from '../data/districts.js';

export default function TheVaultPage({ onBack }) {
  return <DistrictPage district={districtById('vault')} onBack={onBack} status="PROJECT ARCHIVE // UNDER CONSTRUCTION" message="Manga-style project panels are being built here. Each one will open into a full case study." />;
}

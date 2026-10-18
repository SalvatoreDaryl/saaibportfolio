import DistrictPage from './DistrictPage.jsx';
import { districtById } from '../data/districts.js';

export default function TheExitGatePage({ onBack }) {
  return <DistrictPage district={districtById('exit')} onBack={onBack} status="CONTACT // UNDER CONSTRUCTION" message="Contact details and links will appear here once the real addresses are supplied." />;
}

import DistrictPage from './DistrictPage.jsx';
import { districtById } from '../data/districts.js';

export default function TheArsenalPage({ onBack }) {
  return <DistrictPage district={districtById('arsenal')} onBack={onBack} status="SKILLS // UNDER CONSTRUCTION" message="A dedicated skills and technologies page is on its way: programming, web, and creative abilities." />;
}

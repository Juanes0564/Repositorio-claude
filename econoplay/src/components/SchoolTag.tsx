import { schoolName } from '../data';
import type { SchoolId } from '../data/types';

export function SchoolTag({ school }: { school: SchoolId }) {
  return <span className={`school-tag school-tag--${school}`}>{schoolName(school, true)}</span>;
}

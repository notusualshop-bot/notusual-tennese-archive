export interface ArchiveItem {
  id: string;
  category: 'ERA' | 'LEG' | 'TRA' | 'RIV' | 'MOM';
  title: string;
  espnTitle: string;
  dateTag: string;
  narrative: string;
}

import { ERA_DATA } from './eraData';
import { LEG_DATA } from './legData';
import { TRA_DATA } from './traData';
import { RIV_DATA } from './rivData';
import { MOM_DATA } from './momData';

export const TENNESSEE_ARCHIVE_DATA: ArchiveItem[] = [
  ...ERA_DATA,
  ...LEG_DATA,
  ...TRA_DATA,
  ...RIV_DATA,
  ...MOM_DATA,
];

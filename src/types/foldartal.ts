export type FoldartalType = '族群' | '灵魂' | '自然' | '世相' | '视相';
export type FoldartalCategory = '布局' | '本因';
export type FlairType = '延续' | '自足' | '循环' | '广阔' | null;

export interface Foldartal {
  id: number;
  type: FoldartalType;
  name: string;
  nameEn: string;
  nameRune: string;
  category: FoldartalCategory;
  concord: string;
  value: number;
  chant: string;
  god: string;
  godEn: string;
  motto: string;
  flair?: FlairType;
}

export interface Flair {
  id: number;
  name: string;
  icon: string;
  type: '布局' | '本因';
  effect: string;
}

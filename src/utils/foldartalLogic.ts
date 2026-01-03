import { Foldartal, FoldartalType, FoldartalCategory, FlairType } from '../types/foldartal';
import { foldartals } from '../data/foldartals';
import { flairs } from '../data/flairs';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface DeclarationResult {
  layout: Foldartal;
  source: Foldartal;
  concord: string;
  hasConcord: boolean;
  layoutFlair: FlairType;
  sourceFlair: FlairType;
}

export function validateCombination(layoutId: number, sourceId: number): ValidationResult {
  const layout = foldartals.find(f => f.id === layoutId);
  const source = foldartals.find(f => f.id === sourceId);

  if (!layout || !source) {
    return { valid: false, reason: '密文板不存在' };
  }

  if (layout.category !== '布局') {
    return { valid: false, reason: '第一块密文板必须是布局型' };
  }

  if (source.category !== '本因') {
    return { valid: false, reason: '第二块密文板必须是本因型' };
  }

  const isLayoutSociety = layout.type === '世相';
  const isSourceSociety = source.type === '世相';

  if (isLayoutSociety !== isSourceSociety) {
    return { valid: false, reason: '世相类密文板只能与世相类密文板组合' };
  }

  return { valid: true };
}

export function getConcordType(layout: Foldartal, source: Foldartal): string {
  if (layout.type === '世相' || source.type === '世相') {
    return '';
  }

  // 视相触发协语时，协语类型为本因板类型
  if (layout.type === '视相' || source.type === '视相') {
    return source.type === '视相' ? layout.type : source.type;
  }

  // 同类型触发协语时，协语类型为该类型
  if (layout.type === source.type) {
    return layout.type;
  }
  return '';
}

export function getConcord(layout: Foldartal, source: Foldartal): string {

  if (layout.type === '视相' || source.type === '视相') {
    if (layout.concord !== '无') {
      return layout.concord;
    }
    if (source.concord !== '无') {
      return source.concord;
    }
    return '';
  }

  if (layout.type === source.type) {
    if (source.concord !== '无') {
      return source.concord;
    }
  }

  return '';
}

export function hasConcord(layout: Foldartal, source: Foldartal): boolean {
  return getConcord(layout, source) !== '';
}

export function canHaveFlair(foldartal: Foldartal): boolean {
  return foldartal.type !== '世相';
}

export function getRandomFlair(foldartal: Foldartal): FlairType {
  // 修辞触发概率
  const triggerProbability = 0.2;
  if (Math.random() > triggerProbability) {
    return null;
  }

  if (!canHaveFlair(foldartal)) {
    return null;
  }

  const validFlairs = flairs.filter(f => f.type === foldartal.category);

  if (validFlairs.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * validFlairs.length);
  return validFlairs[randomIndex].name as FlairType;
}

export function randomSelectFoldartals(): [Foldartal, Foldartal] {
  const layoutFoldartals = foldartals.filter(f => f.category === '布局');
  const sourceFoldartals = foldartals.filter(f => f.category === '本因');

  const randomLayout = layoutFoldartals[Math.floor(Math.random() * layoutFoldartals.length)];
  const randomSource = sourceFoldartals[Math.floor(Math.random() * sourceFoldartals.length)];

  return [randomLayout, randomSource];
}

export function createDeclaration(layoutId: number, sourceId: number): DeclarationResult | null {
  const validation = validateCombination(layoutId, sourceId);
  if (!validation.valid) {
    return null;
  }

  const layout = foldartals.find(f => f.id === layoutId)!;
  const source = foldartals.find(f => f.id === sourceId)!;

  const concord = getConcord(layout, source);
  const hasConcordValue = hasConcord(layout, source);
  const layoutFlair = getRandomFlair(layout);
  const sourceFlair = getRandomFlair(source);

  return {
    layout,
    source,
    concord,
    hasConcord: hasConcordValue,
    layoutFlair,
    sourceFlair
  };
}

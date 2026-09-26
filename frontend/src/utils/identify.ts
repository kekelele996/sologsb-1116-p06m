import type { BasisSnapshot, FungusRecord, IdentifyLog, SporePrint } from '@/types'

/** 依据快照中某一观察项发生变化的描述 */
export interface BasisChange {
  key: keyof BasisSnapshot
  label: string
  /** 落结论时的原值（展示用） */
  from: string
  /** 当前观察值（展示用） */
  to: string
}

/** 快照字段 → 展示名（仅这些观察值参与依据比对；备注、观察日期等元数据不算） */
export const BASIS_FIELD_LABELS: Record<keyof BasisSnapshot, string> = {
  capShape: '菌盖形状',
  capMargin: '菌盖边缘',
  capTexture: '表面质地',
  fleshReaction: '菌肉变色反应',
  attachment: '着生方式',
  gillDensity: '菌褶密度',
  ring: '菌环',
  volva: '菌托',
  odor: '气味',
  hostTree: '关联树种',
  sporeColor: '孢子印印色',
  sporeShape: '孢子印印形',
  sporeHours: '孢子印获取时长',
  sporeMoisture: '样本干湿度'
}

/** 采集条目与孢子印的当前观察值，生成结论依据快照 */
export function snapshotBasis(record: FungusRecord, spore: SporePrint | null): BasisSnapshot {
  return {
    capShape: record.capShape,
    capMargin: record.capMargin,
    capTexture: record.capTexture,
    fleshReaction: record.fleshReaction,
    attachment: record.attachment,
    gillDensity: record.gillDensity,
    ring: record.ring,
    volva: record.volva,
    odor: record.odor,
    hostTree: record.hostTree,
    sporeColor: spore?.color ?? null,
    sporeShape: spore?.shape ?? null,
    sporeHours: spore?.hours ?? null,
    sporeMoisture: spore?.moisture ?? null
  }
}

/** 归一化观察值用于比对：空值统一为空串，避免「未记录」与「空白」互相误报 */
function normValue(value: string | number | null | undefined): string {
  return value === null || value === undefined ? '' : String(value).trim()
}

/** 展示用取值：空值显示为「未记录」 */
function displayValue(value: string | number | null | undefined): string {
  const text = normValue(value)
  return text === '' ? '未记录' : text
}

/** 逐项比对快照与当前观察值，返回发生变化的项目（无快照或无条目时视为无变化） */
export function diffBasis(
  snapshot: BasisSnapshot | undefined,
  record: FungusRecord | null | undefined,
  spore: SporePrint | null | undefined
): BasisChange[] {
  if (!snapshot || !record) return []
  const current = snapshotBasis(record, spore ?? null)
  return (Object.keys(BASIS_FIELD_LABELS) as (keyof BasisSnapshot)[])
    .filter((key) => normValue(snapshot[key]) !== normValue(current[key]))
    .map((key) => ({
      key,
      label: BASIS_FIELD_LABELS[key],
      from: displayValue(snapshot[key]),
      to: displayValue(current[key])
    }))
}

/** 计算某条结论相对当前观察值的变化项 */
export function basisChangesOf(
  log: IdentifyLog,
  record: FungusRecord | null | undefined,
  spore: SporePrint | null | undefined
): BasisChange[] {
  return diffBasis(log.basisSnapshot, record, spore)
}

/** 变化项标签列表（紧凑展示用），如「孢子印印色、菌盖形状」 */
export function basisChangeLabels(changes: BasisChange[]): string {
  return changes.map((item) => item.label).join('、')
}

/** 变化项含原值→现值（详情展示用），如「孢子印印色 白色→粉褐」 */
export function formatBasisChanges(changes: BasisChange[]): string {
  return changes.map((item) => `${item.label} ${item.from}→${item.to}`).join('；')
}

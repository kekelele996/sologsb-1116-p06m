import type { FungusRecord, IdentifyLog, IdSnapshot, SporePrint } from '@/types'

/** 参与结论依据比对的观察字段（与候选排序依据一致；备注、观察日期等不在其列） */
export const SNAPSHOT_FIELDS: { key: keyof IdSnapshot; label: string }[] = [
  { key: 'attachment', label: '着生方式' },
  { key: 'capShape', label: '菌盖形状' },
  { key: 'capMargin', label: '菌盖边缘' },
  { key: 'capTexture', label: '表面质地' },
  { key: 'gillDensity', label: '菌褶密度' },
  { key: 'fleshReaction', label: '菌肉变色反应' },
  { key: 'hostTree', label: '关联树种' },
  { key: 'sporeColor', label: '孢子印印色' }
]

/** 一项观察值的变更：从落论时的值到当前值 */
export interface SnapshotChange {
  key: keyof IdSnapshot
  label: string
  from: string
  to: string
}

/** 条目 + 孢子印 → 当前观察值快照（落结论时调用，记住当时采用的依据） */
export function snapshotOf(record: FungusRecord, spore: SporePrint | null): IdSnapshot {
  return {
    attachment: record.attachment,
    capShape: record.capShape,
    capMargin: record.capMargin,
    capTexture: record.capTexture,
    gillDensity: record.gillDensity,
    fleshReaction: record.fleshReaction,
    hostTree: record.hostTree,
    sporeColor: spore?.color ?? ''
  }
}

function displayValue(value: string): string {
  return value === '' ? '未记录' : value
}

/** 快照与当前观察值逐项比对，返回变更项（空数组 = 观察值与落论时一致） */
export function diffSnapshot(snapshot: IdSnapshot, record: FungusRecord, spore: SporePrint | null): SnapshotChange[] {
  const current = snapshotOf(record, spore)
  return SNAPSHOT_FIELDS.filter(({ key }) => snapshot[key] !== current[key]).map(({ key, label }) => ({
    key,
    label,
    from: displayValue(snapshot[key]),
    to: displayValue(current[key])
  }))
}

/** 结论的依据变更项；观察值改回落论时的值后自动归零，结论恢复原状态 */
export function snapshotChanges(log: IdentifyLog, records: FungusRecord[], spores: SporePrint[]): SnapshotChange[] {
  if (!log.snapshot) return []
  const record = records.find((item) => item.id === log.recordId)
  if (!record) return []
  const spore = spores.find((item) => item.recordId === log.recordId) ?? null
  return diffSnapshot(log.snapshot, record, spore)
}

/** 结论是否应视为待复核：人工勾选待复核，或落论依据的观察值已变更 */
export function logNeedsReview(log: IdentifyLog, records: FungusRecord[], spores: SporePrint[]): boolean {
  return log.needReview || snapshotChanges(log, records, spores).length > 0
}

/** 变更项展示文案，如「孢子印印色 白色 → 奶油色」 */
export function formatChange(change: SnapshotChange): string {
  return `${change.label} ${change.from} → ${change.to}`
}

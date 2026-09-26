import type {
  CapMargin,
  CapShape,
  CapTexture,
  FleshReaction,
  GillAttachment,
  GillDensity,
  RingType,
  VolvaType
} from './record'
import type { SporeColor } from './spore'

/** 鉴定依据 */
export const ID_BASES = ['形态特征', '孢子印', '显微观察'] as const
export type IdBasis = (typeof ID_BASES)[number]

/** 置信度 */
export const ID_CONFIDENCES = ['高', '中', '低'] as const
export type IdConfidence = (typeof ID_CONFIDENCES)[number]

/**
 * 结论落定时留存的形态/孢子印观察值快照。
 * 仅收录参与鉴定的观察值；备注、观察日期、采集日期等元数据不入快照，
 * 后续与当前观察值逐项比对，判断结论依据是否仍然成立。
 */
export interface BasisSnapshot {
  capShape: CapShape
  capMargin: CapMargin
  capTexture: CapTexture
  fleshReaction: FleshReaction
  attachment: GillAttachment
  gillDensity: GillDensity
  ring: RingType
  volva: VolvaType
  /** 气味 */
  odor: string
  /** 生境关联树种 */
  hostTree: string
  /** 孢子印印色（未做印时为 null） */
  sporeColor: SporeColor | null
  /** 孢子印印形 */
  sporeShape: string | null
  /** 孢子印获取时长（小时） */
  sporeHours: number | null
  /** 样本干湿度说明 */
  sporeMoisture: string | null
}

/** IdentifyLog 鉴定结论 */
export interface IdentifyLog {
  id: string
  recordId: string
  /** 结论学名 */
  conclusion: string
  basis: IdBasis
  /** 参考图鉴名称 */
  referenceBook: string
  /** 页码 */
  referencePage: string
  confidence: IdConfidence
  needReview: boolean
  reviewer: string
  date: string
  /** 保存结论时采用的形态/孢子印观察值快照（历史数据由迁移补齐） */
  basisSnapshot?: BasisSnapshot
}

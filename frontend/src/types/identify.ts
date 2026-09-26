import type { CapMargin, CapShape, CapTexture, FleshReaction, GillAttachment, GillDensity } from './record'
import type { SporeColor } from './spore'

/** 鉴定依据 */
export const ID_BASES = ['形态特征', '孢子印', '显微观察'] as const
export type IdBasis = (typeof ID_BASES)[number]

/** 置信度 */
export const ID_CONFIDENCES = ['高', '中', '低'] as const
export type IdConfidence = (typeof ID_CONFIDENCES)[number]

/**
 * 落结论时采用的形态 / 孢子印观察值快照。
 * 与候选排序共用同一组依据字段；备注、观察日期等不参与比对。
 */
export interface IdSnapshot {
  /** 菌褶/菌管着生方式 */
  attachment: GillAttachment
  /** 菌盖形状 */
  capShape: CapShape
  /** 菌盖边缘 */
  capMargin: CapMargin
  /** 表面质地 */
  capTexture: CapTexture
  /** 菌褶密度 */
  gillDensity: GillDensity
  /** 菌肉变色反应 */
  fleshReaction: FleshReaction
  /** 生境关联树种 */
  hostTree: string
  /** 孢子印印色（空串表示落论时尚未记录孢子印） */
  sporeColor: SporeColor | ''
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
  /** 落论时的观察值快照；这些观察值后续变更时结论自动进入待复核 */
  snapshot?: IdSnapshot
}

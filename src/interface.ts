import type { CSSProperties, TeleportProps, ComponentPublicInstance } from 'vue'

export type ImagePreviewOptions = {
  loop?: boolean
  images: string[]
  maxZoom?: number
  minZoom?: number
  teleport?: TeleportProps['to']
  className?: unknown
  showIndex?: boolean
  closeable?: boolean
  closeIcon?: string
  transition?: string
  overlayStyle?: CSSProperties
  overlayClass?: unknown
  swipeDuration?: number
  startPosition?: number
  showIndicators?: boolean
  closeOnPopstate?: boolean
  onClose?(): void
  onScale?(args: { scale: number; index: number }): void
  onChange?(index: number): void
}

export type ImagePreviewScaleEventParams = {
  scale: number
  index: number
}

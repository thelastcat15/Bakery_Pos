export interface Category {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  href?: string
  className?: string
}

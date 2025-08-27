interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
}

interface CategoryButtonProps {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  className?: string
}

interface CartProps {
  onClick: () => void
  className?: string
}

export const PrimaryButton = ({
  children,
  onClick,
  className = "",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-colors ${className}`}>
      {children}
    </button>
  )
}

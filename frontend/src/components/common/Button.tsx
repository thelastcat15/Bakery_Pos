import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  href?: string
  className?: string
}

interface CategoryButtonProps {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  href?: string
  className?: string
}

interface CartButtonProps {
  onClick: () => void
  href?: string
  className?: string
}

export const PrimaryButton = ({
  children,
  onClick,
  href,
  className = "",
}: ButtonProps) => {
  const buttonClass = `bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-colors ${className}`

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  )
}

export const CategoryButton = ({
  children,
  active = false,
  onClick,
  href,
  className = "",
}: CategoryButtonProps) => {
  const activeClass = active
    ? `bg-amber-500 text-white`
    : `bg-gray-200 text-gray-700 hover:bg-gray-300`
  const buttonClass = `px-4 py-2 min-w-24 rounded-full transition-colors ${activeClass} ${className}`
  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  )
}

export const CartButton = ({
  onClick,
  href,
  className = "",
}: CartButtonProps) => {
  const buttonClass = `bg-amber-500 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-600 transition-colors ${className}`
  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        เพิ่ม
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={buttonClass}>
      เพิ่ม
    </button>
  )
}

import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

interface CategoryButtonProps {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  href?: string
  className?: string
}

interface CartButtonProps {
  children: React.ReactNode
  onClick: () => void
  href?: string
  className?: string
}

interface IncreaseButtonProps {
  onClick: () => void
}

interface DecreaseButtonProps {
  onClick: () => void
}

export const PrimaryButton = ({
  children,
  onClick,
  href,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const buttonClass = `bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-colors ${
    disabled ? "opacity-50 cursor-not-allowed hover:bg-amber-500" : ""
  } ${className}`

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    )
  }
  return (
    <button
      onClick={onClick}
      className={buttonClass}
      type={type}
      disabled={disabled}>
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
  children,
  onClick,
  href,
  className = "",
}: CartButtonProps) => {
  const buttonClass = `bg-amber-500 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-600 transition-colors ${className}`
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

export const IncreaseButton = ({ onClick }: IncreaseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 p-1 md:p-2 rounded-full cursor-pointer hover:bg-gray-300">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4">
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </button>
  )
}

export const DecreaseButton = ({ onClick }: DecreaseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 p-1 md:p-2 rounded-full cursor-pointer hover:bg-gray-300">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4">
          <path
            fillRule="evenodd"
            d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </button>
  )
}

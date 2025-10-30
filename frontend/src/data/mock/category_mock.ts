import { Category } from "@/types/category_type"

export const categories: Category[] = [
  {
    children: "เค้ก",
    active: true,
    onClick: () => console.log("Go to Cake"),
    // href: "/categories/cake",
  },
  {
    children: "ขนมปัง",
    onClick: () => console.log("Go to Bread"),
    // href: "/categories/bread",
  },
  {
    children: "ครัวซองต์",
    onClick: () => console.log("Go to Croissant"),
    // href: "/categories/croissant",
  },
  {
    children: "ทาร์ต",
    onClick: () => console.log("Go to Tart"),
    // href: "/categories/tart",
  },
  {
    children: "มัฟฟินนนนนนนนนนนนนนน",
    onClick: () => console.log("Go to Muffin"),
    // href: "/categories/muffin",
  },
  {
    children: "โดนัท",
    onClick: () => console.log("Go to Donut"),
    // href: "/categories/donut",
  },
  {
    children: "มาการอง",
    onClick: () => console.log("Go to Macaron"),
    // href: "/categories/macaron",
  },
]

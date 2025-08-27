interface Product {
  id: number
  name: string
  image: string
  detail: string
  price: number
  category: string
  stock?: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Chocolate Cake",
    image: "/images/products/cake.jpg",
    detail: "เค้กช็อกโกแลตเนื้อนุ่ม ราดด้วยซอสช็อกโกแลตเข้มข้น",
    price: 120,
    category: "Cake",
    stock: 10,
  },
  {
    id: 2,
    name: "Strawberry Tart",
    image: "/images/products/strawberry-tart.jpg",
    detail: "ทาร์ตสตรอว์เบอร์รีสด พร้อมครีมวานิลลาโฮมเมด",
    price: 95,
    category: "Tart",
    stock: 8,
  },
  {
    id: 3,
    name: "Croissant",
    image: "/images/products/croissant.jpg",
    detail: "ครัวซองต์เนยแท้ หอมกรุ่นจากเตาทุกเช้า",
    price: 45,
    category: "Bakery",
    stock: 15,
  },
  {
    id: 4,
    name: "Blueberry Muffin",
    image: "/images/products/muffins.jpg",
    detail: "มัฟฟินบลูเบอร์รีเนื้อชุ่มฉ่ำ เต็มไปด้วยผลไม้",
    price: 55,
    category: "Muffin",
    stock: 12,
  },
  {
    id: 5,
    name: "French Baguette",
    image: "/images/products/baguette.jpg",
    detail: "บาแกตต์สไตล์ฝรั่งเศส เปลือกกรอบ เนื้อในนุ่ม",
    price: 60,
    category: "Bread",
    stock: 20,
  },
  {
    id: 6,
    name: "Cupcake Vanilla",
    image: "/images/products/cupcakes.jpg",
    detail: "คัพเค้กวานิลลา หอมเนย โรยด้วยช็อกโกแลตชิพ",
    price: 40,
    category: "Cupcake",
    stock: 25,
  },
  {
    id: 7,
    name: "Macarons Box",
    image: "/images/products/macaroons.jpg",
    detail: "มาการองรวมรสชาติ 6 ชิ้น สีสันสดใส",
    price: 150,
    category: "Dessert",
    stock: 5,
  },
  {
    id: 8,
    name: "Cheesecake Slice",
    image: "/images/products/cheesecake.jpg",
    detail: "ชีสเค้กเนื้อนุ่ม ราดซอสเบอร์รีเปรี้ยวหวาน",
    price: 85,
    category: "Cake",
    stock: 9,
  },
  {
    id: 9,
    name: "Donuts Box",
    image: "/images/products/donut.jpg",
    detail: "โดนัทสีสันสดใส 4 ชิ้น เลือกหน้าได้",
    price: 110,
    category: "Donut",
    stock: 7,
  },
  {
    id: 10,
    name: "Brownie Fudge",
    image: "/images/products/brownie.jpg",
    detail: "บราวนี่ฟัดจ์เนื้อหนึบ รสเข้มข้น หวานกำลังดี",
    price: 70,
    category: "Brownie",
    stock: 13,
  },
]

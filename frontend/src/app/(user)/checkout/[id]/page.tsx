"use client"
import { PrimaryButton } from "@/components/common/Button"
import { useOrders } from "@/hooks/useOrders"
import { useUser } from "@/hooks/useUser"
import { Order } from "@/types/order_type"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"



const CheckoutPage = () => {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order>()
  const { getOrderById } = useOrders()
  const { user, isProfileComplete, isLoaded: userLoaded } = useUser()

  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editingInfo, setEditingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (user) {
      setEditingInfo({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  useEffect(() => {
    if (userLoaded && user) {
      if (!isProfileComplete) {
        setShowEditProfile(true)
      }
      if (orderId && !order) {
        const fetchOrder = async () => {
          const data = await getOrderById(orderId)
          setOrder(data)
        }
        fetchOrder()
      }
    }
  }, [userLoaded, user, isProfileComplete])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentSlip(file)
    }
  }

  const handleSubmitOrder = async () => {
    if (
      !editingInfo.name ||
      !editingInfo.phone ||
      !editingInfo.address ||
      !paymentSlip
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและแนบสลิปการโอนเงิน")
      return
    }

    if (order && order.items.length === 0) {
      alert("ไม่มีตะกร้าสินค้า")
      return
    }

    setIsSubmitting(true)

    try {
      const customerInfo = {
        name: editingInfo.name,
        phone: editingInfo.phone,
        address: editingInfo.address,
      }

      alert(
        `สั่งซื้อสำเร็จ! หมายเลขคำสั่งซื้อ: ${orderId}\nคำสั่งซื้อของคุณอยู่ในระหว่างการตรวจสอบ`
      )

      // redirect to tracking page
      router.push(`/tracking`)
    } catch (error) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-6">ชำระเงิน</h1>

      {!userLoaded && !user ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500 mb-4">
            กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ
          </p>
          <PrimaryButton href="/login">เข้าสู่ระบบ</PrimaryButton>
        </div>
      ) : (order && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order summary */}
          <div className="bg-white rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ฿{item.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ฿{(item.price * item.quantity!!).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />
            <div className="flex justify-between items-center text-lg font-bold text-amber-500">
              <span>ยอดรวมทั้งหมด</span>
              <span>฿{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information & Payment */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">ข้อมูลลูกค้า</h2>
                <button
                  onClick={() => setShowEditProfile(!showEditProfile)}
                  className="text-amber-500 hover:text-amber text-sm font-medium">
                  {showEditProfile ? "ยกเลิก" : "แก้ไข"}
                </button>
              </div>

              {showEditProfile ? (
                // Edit form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editingInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rouded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rouded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="0XX-XXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ที่อยู่จัดส่ง *
                    </label>
                    <textarea
                      name="address"
                      value={editingInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rouded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="กรุณากรอกที่อยู่สำหรับจัดส่ง"
                    />
                  </div>

                  <PrimaryButton
                    onClick={() =>
                      // call api
                      setShowEditProfile(false)
                    }
                    className="w-full">
                    บันทึกข้อมูล
                  </PrimaryButton>
                </div>
              ) : (
                // display user info
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
                    <p className="font-medium">{user?.name || "ไม่ได้ระบุ"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                    <p className="font-medium">{user?.phone || "ไม่ได้ระบุ"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ที่อยู่จัดส่ง</p>
                    <p className="font-medium">
                      {user?.address || "ไม่ได้ระบุ"}
                    </p>
                  </div>

                  {!isProfileComplete() && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                      <p className="text-red-700 text-sm">
                        ! กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการสั่งซื้อ
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl md:p-6">
              <h2 className="text-lg font-semibold mb-4">การชำระเงิน</h2>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-amber-800 mb-2">
                  ข้อมูลการโอนเงิน
                </h3>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>
                    <strong>ธนาคาร:</strong> กสิกรไทย
                  </p>
                  <p>
                    <strong>เลขบัญชี:</strong> 123-4-56789-0
                  </p>
                  <p>
                    <strong>ชื่อบัญชี:</strong> Sweet Heaven
                  </p>
                  <p>
                    <strong>จำนวนเงิน:</strong> ฿{order.total.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    แนบสลิปการโอนเงิน *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="payment-slip"
                    />
                    <label htmlFor="payment-slip" className="cursor-pointer">
                      {paymentSlip ? (
                        <div className="text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 mb-2 mx-auto">
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>

                          <p className="text-sm font-medium">
                            {paymentSlip.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            คลิกเพื่อเปลี่ยน
                          </p>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 mb-2 mx-auto">
                            <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
                          </svg>
                          <p className="text-sm font-medium">
                            คลิกเพื่อเลือกไฟล์สลิป
                          </p>
                          <p className="text-xs">รองรับ JPG, PNG</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              {order.items.length > 0 ? (
                <PrimaryButton
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !isProfileComplete || !paymentSlip}
                  className="w-full">
                  {isSubmitting ? "กำลังส่งคำสั่งซื้อ" : "ยืนยันคำสั่งซื้อ"}
                </PrimaryButton>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default CheckoutPage

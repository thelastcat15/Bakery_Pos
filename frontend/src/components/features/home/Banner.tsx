"use client"
import { PrimaryButton } from "@/components/common/Button"

const Banner = () => {
  return (
    <article className="bg-gradient-to-r from-yellow-200 to-orange-300">
      <div className="max-w-4xl mx-auto">
        <div className="w-full flex flex-col justify-center items-center gap-8 py-8 px-4 md:px-0 md:py-20">
          <h1 className="font-bold text-2xl md:text-4xl text-center first-letter:text-3xl">
            อบใหม่ทุกวัน หอมหวานถึงใจ - รสชาติที่คุณจะไม่ลืม
          </h1>
          <p className="text-lg text-center text-gray-600 text-pretty">
            สัมผัสความอร่อยจากขนมปังและเค้กที่อบสดใหม่ทุกเช้า
            ด้วยวัตถุดิบคุณภาพและสูตรพิเศษที่ได้รับการคัดสรรมาอย่างดี
            เพื่อมอบประสบการณ์การชิมที่พิเศษให้กับคุณและครอบครัว
          </p>

          <PrimaryButton onClick={() => console.log("Primary click!")}>
            ช็อปเลย
          </PrimaryButton>

        </div>
      </div>
    </article>
  )
}
export default Banner

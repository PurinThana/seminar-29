"use client";
export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">

            {/* Logo */}
            <div className="mb-6 ">
                <img
                    src="logo.png" // เปลี่ยนเป็น path โลโก้ของคุณ
                    alt="Logo"
                    className="w-32 h-32 object-contain rounded-2xl"
                />
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
                ขอบคุณสำหรับการบันทึกข้อมูล!
            </h1>

            {/* Subtext / Description */}
            {/* <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
                ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว คุณสามารถกลับไปยังหน้าหลัก หรือดำเนินการต่อไป
            </p> */}


        </div>
    );
}

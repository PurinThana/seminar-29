"use client"
import axios from "axios";
import { useParams } from "next/navigation";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function PriceForm() {
    const { auction_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [auction, setAuction] = useState({});
    const [rawPrice, setRawPrice] = useState(""); // เก็บตัวเลขจริง
    const [displayPrice, setDisplayPrice] = useState(""); // แสดง comma

    const handlePriceChange = (e) => {
        let raw = e.target.value.replace(/,/g, ""); // ลบ comma
        if (!/^\d*$/.test(raw)) return; // รับเฉพาะตัวเลข
        setRawPrice(raw); // เก็บค่าจริง
        const formatted = raw ? Number(raw).toLocaleString("en-US") : "";
        setDisplayPrice(formatted); // แสดง comma
    };

    const loadData = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get("/api/auction/" + auction_id);
            console.log(res.data)
            setAuction(res.data);
        } catch (err) {
            console.error("Error loading auctions:", err);
            setIsError({
                status: true, message: "Something went wrong. Please try agian."
            })
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        loadData()
    }, [auction_id])



    const handleOnSubmit = async (e) => {
        e.preventDefault(); // ป้องกัน form reload
        if (rawPrice <= 0 || rawPrice == "") {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "กรุณากรอกจำนวนให้ถูกต้อง",
                icon: "error",
                background: "#1F2937",
                color: "#F9FAFB",
                confirmButtonColor: "#10B981",
            });
            return
        }
        const result = await Swal.fire({
            title: "ยืนยันการบันทึกข้อมูล?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            background: "#1F2937", // dark background
            color: "#F9FAFB",      // text color
            confirmButtonColor: "#10B981",
            cancelButtonColor: "#EF4444",
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.post("/api/offer", {
                    auction_id: Number(auction_id),
                    price: Number(rawPrice),

                });

                // ไปหน้า ThankYou
                window.location.href = "/ThankYou";

            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: error.message,
                    icon: "error",
                    background: "#1F2937",
                    color: "#F9FAFB",
                    confirmButtonColor: "#10B981",
                });
            }
        }
    };
    if (isLoading) return (
        <div className="bg-gray-900 flex justify-center min-h-screen items-center">
            <p>Loading...</p>
        </div>
    )
    return (
        <div className="p-4 max-w-md mx-auto space-y-6 min-h-screen flex flex-col justify-center">
            {/* Section: Text Display */}
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">

                    ข้อมูล
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                        <h1>ราคาเปิดประมูล</h1>
                        <h1>{Number(auction.fields.price).toLocaleString()} บาท</h1>
                    </div>
                    <div className="flex justify-between">
                        <h1>ปริมาณสำรอง</h1>
                        <h1>{Number(auction.fields.reserve).toLocaleString()} ตัน</h1>
                    </div>
                    <div className="flex justify-between">
                        <h1>ราคาบาทต่อตัน</h1>
                        <h1>{Number(auction.fields.price / auction.fields.reserve).toLocaleString()} บาทต่อตัน</h1>
                    </div>

                </div>
            </div>

            {/* Section: Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ราคาบาทต่อตัน
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="0"
                    value={displayPrice}
                    onChange={handlePriceChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
            </div>

            <button
                onClick={(e) => handleOnSubmit(e)}
                className={`
          w-full px-4 py-2 rounded-md font-semibold text-white
          bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400
          dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-300
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        `}
            >
                ยืนยัน
            </button>
        </div>
    );
}

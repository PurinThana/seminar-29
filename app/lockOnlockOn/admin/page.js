"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminHome() {
    const [isLoading, setIsLoading] = useState(true)
    const [auctions, setAuctions] = useState([]);
    const [offers, setOffers] = useState([]);
    const [auctionForm, setAuctionForm] = useState({ name: "", price: "", reserve: "" });
    const [offerForm, setOfferForm] = useState({ price: "", auction_id: "" });
    const [isError, setIsError] = useState({
        status: false, message: ""
    })
    const [showHead, setShowHead] = useState("")

    const [isShow, setIsShow] = useState(false)
    // โหลด auctions
    const loadAuctions = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get("/api/auction");
            setAuctions(res.data);
        } catch (err) {
            console.error("Error loading auctions:", err);
            setIsError({
                status: true, message: "Something went wrong. Please try agian."
            })
        } finally {
            setIsLoading(false)
        }
    };

    // โหลด offers
    const loadOffers = async (e, auction_id, name) => {
        e.preventDefault()
        try {

            const res = await axios.get("/api/offer/filter/" + auction_id)
            setShowHead(name)
            setOffers(res.data);
        } catch (err) {
            console.error("Error loading offers:", err);
        } finally {
            setIsShow(true)
        }
    };

    // เพิ่ม Auction
    const createAuction = async () => {
        try {
            await axios.post("/api/auction", auctionForm);
            setAuctionForm({ name: "", price: "", reserve: "" });
            loadAuctions();
        } catch (err) {
            console.error("Error creating auction:", err);
        }
    };

    // เพิ่ม Offer
    const createOffer = async () => {
        try {
            await axios.post("/api/offer", offerForm);
            setOfferForm({ price: "", auction_id: "" });
            loadOffers();
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    };

    const handleOnClose = () => {
        setIsShow(false)
        setOffers([])
        setShowHead("")
    }

    useEffect(() => {
        loadAuctions();

    }, []);

    return (
        <main className="p-10">
            <h1 className="text-2xl font-bold mb-6">Admin Page</h1>

            {/* Auction Form */}
            <div className="mb-6">
                <h2 className="text-xl font-bold">Create Auction</h2>
                <input
                    className="border p-2 mr-2"
                    placeholder="Name"
                    value={auctionForm.name}
                    onChange={(e) => setAuctionForm({ ...auctionForm, name: e.target.value })}
                />
                <input
                    className="border p-2 mr-2"
                    placeholder="Price"
                    value={auctionForm.price}
                    onChange={(e) => setAuctionForm({ ...auctionForm, price: e.target.value })}
                />
                <input
                    className="border p-2 mr-2"
                    placeholder="Reserve"
                    value={auctionForm.reserve}
                    onChange={(e) => setAuctionForm({ ...auctionForm, reserve: e.target.value })}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={createAuction}
                >
                    Add +
                </button>
            </div>


            {/* Auction Table */}
            <h2 className="text-xl font-bold mb-2">Auctions</h2>
            {isError.status ? <>
                {isError.message}
            </> : isLoading ? <>
                loading...
            </> :
                <table className="border w-full mb-6 bg-gray-800">
                    <thead>
                        <tr className="">

                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Price</th>
                            <th className="p-2 border">Reserve</th>
                            <th className="p-2 border"></th>
                        </tr>
                    </thead>

                    <tbody className="text-center">


                        {auctions.map((a) => (
                            <tr key={a.id}>

                                <td className="p-2 border">{a.name}</td>
                                <td className="p-2 border">{a.price}</td>
                                <td className="p-2 border">{a.reserve}</td>
                                <td className="p-2 border">
                                    <span>
                                        <button onClick={(e) => loadOffers(e, a.id, a.name)} className=" mx-2 bg-gray-700 py-1 px-2 rounded-md hover:underline hover:text-blue-500" >View</button>
                                    </span>
                                    <span>
                                        <button className=" bg-gray-700 py-1 px-2 rounded-md hover:underline hover:text-red-500" >Delete</button>
                                    </span>
                                </td>
                            </tr>
                        ))}



                    </tbody>

                </table>
            }
            {isShow ? <>
                <div className="flex justify-between mb-2">
                    <h1 className="text-xl font-bold">แสดงการให้ราคาของ {showHead}</h1>
                    <button onClick={() => handleOnClose()} className=" bg-gray-700 py-1 px-2 rounded-md hover:underline hover:text-red-500" >ปิด</button>
                </div>
                <table className="border w-full mb-6 bg-gray-800">
                    <thead>
                        <tr className="">

                            <th className="p-2 border">No.</th>
                            <th className="p-2 border">Price</th>

                        </tr>
                    </thead>

                    <tbody className="text-center">


                        {offers.map((a, index) => (
                            <tr key={a.id}>

                                <td className="p-2 border">{index}</td>
                                <td className="p-2 border">{a.price}</td>

                            </tr>
                        ))}



                    </tbody>

                </table>
            </>
                : null}


        </main>
    );
}

//app/api/offer/[id]/route.js
import axios from "axios";

const baseURL = process.env.GRIST_BASE_URL;
const docId = process.env.GRIST_DOC_ID;
const apiKey = process.env.GRIST_API_KEY;

const client = axios.create({
    baseURL: `${baseURL}${docId}/tables/2/records`,
    headers: { Authorization: `Bearer ${apiKey}` },
});

export async function GET(req, { params }) {

    const { auction_id } = await params; // <-- dynamic route param [id]

    try {


        const res = await client.get("/", {
            params: {
                filter: JSON.stringify({
                    auction_id: [Number(auction_id)] // หรือ id: Number(id) ถ้า filter รับตัวเดียว
                })
            }
        });
        const offers = res.data.records.map(r => ({
            id: r.id,
            ...r.fields
        }));

        return Response.json(offers); // ✅ เป็น array ของ object



    } catch (error) {
        return Response.json(error.message)
    }

}

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { ...fields } = body
        console.log(
            { records: [{ id, fields }] }
        )

        const res = await client.patch('/', { records: [{ id: Number(id), fields }] })
        return Response.json(res.data);
    } catch (error) {
        console.log(error)
        return Response.json({ error: error.message }, { status: 500 })

    }
}


export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const res = await axios.post(`${baseURL}${docId}/tables/1/data/delete`, [Number(id)], { headers: { Authorization: `Bearer ${apiKey}` } });
        return Response.json(res.data);
    } catch (error) {
        console.log(error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
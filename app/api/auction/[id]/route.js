//app/api/auction/[id]/route.js
import axios from "axios";

const baseURL = process.env.GRIST_BASE_URL;
const docId = process.env.GRIST_DOC_ID;
const apiKey = process.env.GRIST_API_KEY;

const client = axios.create({
    baseURL: `${baseURL}${docId}/tables/1/records`,
    headers: { Authorization: `Bearer ${apiKey}` },
});

export async function GET(req, { params }) {

    const { id } = await params; // <-- dynamic route param [id]

    try {


        const res = await client.get("/", {
            params: {
                filter: JSON.stringify({
                    id: [Number(id)] // หรือ id: Number(id) ถ้า filter รับตัวเดียว
                })
            }
        });


        return Response.json(res.data.records[0]);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
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
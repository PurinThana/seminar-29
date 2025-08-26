//app/api/offer/route.js
import axios from "axios";

const baseURL = process.env.GRIST_BASE_URL;
const docId = process.env.GRIST_DOC_ID;
const apiKey = process.env.GRIST_API_KEY;

const client = axios.create({
    baseURL: `${baseURL}${docId}/tables/2/records`,
    headers: { Authorization: `Bearer ${apiKey}` },
});

// ✅ GET all offers
export async function GET() {
    try {
        const res = await client.get("/");
        return Response.json(res.data.records.map(r => ({ id: r.id, ...r.fields })));
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// ✅ POST create offer
export async function POST(req) {
    const body = await req.json();
    const res = await client.post("/", { records: [{ fields: body }] });
    return Response.json(res.data);
}



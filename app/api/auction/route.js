//app/api/auction/route.js
import axios from "axios";

const baseURL = process.env.GRIST_BASE_URL;
const docId = process.env.GRIST_DOC_ID;
const apiKey = process.env.GRIST_API_KEY;

const client = axios.create({
    baseURL: `${baseURL}${docId}/tables/1/records`,
    headers: { Authorization: `Bearer ${apiKey}` },
});

// ✅ GET all auctions
export async function GET() {
    const res = await client.get("/");
    return Response.json(res.data.records.map(r => ({ id: r.id, ...r.fields })));

}

// ✅ POST create auction
export async function POST(req) {
    const body = await req.json();
    const res = await client.post("/", { records: [{ fields: body }] });
    return Response.json(res.data);
}

// ✅ PUT update auction
export async function PUT(req) {
    const body = await req.json();
    const { id, ...fields } = body;
    const res = await client.patch("/", { records: [{ id, fields }] });
    return Response.json(res.data);
}

// ✅ DELETE auction
export async function DELETE(req) {
    const { id } = await req.json();
    const res = await client.delete("/", { data: { records: [id] } });
    return Response.json(res.data);
}

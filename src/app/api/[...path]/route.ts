import { type NextRequest, NextResponse } from "next/server"

async function proxy(request: NextRequest, path: string[]) {
  const base = process.env.API_URL ?? "http://localhost:8001"
  const url = `${base}/${path.join("/")}${request.nextUrl.search}`

  const headers: HeadersInit = {}
  const ct = request.headers.get("content-type")
  if (ct) headers["content-type"] = ct

  const init: RequestInit = { method: request.method, headers }
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text()
  }

  const res = await fetch(url, init)
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path)
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path)
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path)
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path)
}

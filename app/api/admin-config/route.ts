import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return NextResponse.json({ adminEmail: adminEmail || null });
  } catch (err) {
    console.error("Admin config fetch error:", err);
    return NextResponse.json({ adminEmail: null }, { status: 500 });
  }
}

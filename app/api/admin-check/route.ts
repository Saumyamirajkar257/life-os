import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_verified')?.value;
    const jwtSecret = process.env.ADMIN_JWT_SECRET;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!token) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    if (!jwtSecret || !adminEmail) {
      console.error("Missing admin server environment variables in admin-check.");
      return NextResponse.json({ verified: false, error: "Server Configuration Error" }, { status: 500 });
    }

    const payload = verifyToken(token, jwtSecret);
    if (!payload || !payload.verified || payload.adminEmail !== adminEmail) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("Admin check error:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}

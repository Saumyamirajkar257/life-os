import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_verified')?.value;
    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'lifeos-default-jwt-secret-key-2026';
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'saumyamir25@gmail.com';

    if (!token) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    const payload = verifyToken(token, jwtSecret);
    if (!payload || !payload.verified || payload.adminEmail?.toLowerCase().trim() !== adminEmail?.toLowerCase().trim()) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("Admin check error:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}

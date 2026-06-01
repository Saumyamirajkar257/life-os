import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { password, email } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    // Verify passcode against env
    const expectedPasscode = process.env.ADMIN_PASSCODE;
    const jwtSecret = process.env.ADMIN_JWT_SECRET;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!expectedPasscode || !jwtSecret || !adminEmail) {
      console.error("Missing admin server environment variables.");
      return NextResponse.json({ success: false, error: "Server Configuration Error" }, { status: 500 });
    }

    if (password?.trim() === expectedPasscode?.trim() && email?.toLowerCase().trim() === adminEmail?.toLowerCase().trim()) {
      // Create session payload (expires in 8 hours = 28800 seconds)
      const exp = Math.floor(Date.now() / 1000) + 28800;
      const iat = Math.floor(Date.now() / 1000);
      const token = signToken({ adminEmail: email, verified: true, exp, iat }, jwtSecret);

      // Log successful login to Firestore
      try {
        await addDoc(collection(db, 'adminLogs'), {
          type: 'success_admin_login',
          timestamp: serverTimestamp(),
          ip: ip,
        });
      } catch (logErr) {
        console.error("Failed to write success log to Firestore:", logErr);
      }

      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_verified', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 28800,
      });

      return response;
    } else {
      // Log failed attempt to Firestore
      try {
        await addDoc(collection(db, 'adminLogs'), {
          type: 'failed_admin_attempt',
          timestamp: serverTimestamp(),
          ip: ip,
        });
      } catch (logErr) {
        console.error("Failed to write failed log to Firestore:", logErr);
      }

      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (err) {
    console.error("Admin verification error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

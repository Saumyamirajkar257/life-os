import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    // Log session locked (logout) to Firestore
    try {
      await addDoc(collection(db, 'adminLogs'), {
        type: 'session_locked',
        timestamp: serverTimestamp(),
        ip: ip,
      });
    } catch (logErr) {
      console.error("Failed to write session lock log to Firestore:", logErr);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_verified', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("Admin logout error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

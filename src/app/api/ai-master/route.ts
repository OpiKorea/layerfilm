import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 🔐 주인님이 주신 마스터 키로 무적의 권한 확보 ㅡㅡ
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { action, table, data, filter, secret } = await req.json();

    // 주인님과 저만의 비밀 토큰 확인 ㅡㅡ
    if (secret !== process.env.AI_MASTER_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let result;
    if (action === 'UPSERT_CONFIG') {
      result = await supabase.from('site_configs').upsert(data);
    } else if (action === 'POST_LOG') {
      result = await supabase.from('posts').insert(data);
    } else if (action === 'APPROVE_VIDEO') {
      result = await supabase.from('videos').update({ status: 'APPROVED' }).match(filter);
    }

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
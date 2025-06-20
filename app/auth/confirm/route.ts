import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (!error) {
      // Redirect to the login page with a success message
      return NextResponse.redirect(
        `${requestUrl.origin}/login`
      )
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=メールアドレスの確認に失敗しました。もう一度お試しください。`
  )
}
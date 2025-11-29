import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Check profile completion status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_profile_completed')
      .eq('id', user.id)
      .single()

    const isOnboarding = request.nextUrl.pathname === '/onboarding'
    const isProfileCompleted = profile?.is_profile_completed
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')

    // If user is logged in and tries to access auth pages, redirect them
    if (isAuthPage) {
      if (!isProfileCompleted) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
      return NextResponse.redirect(new URL('/student', request.url))
    }

    // If profile is not completed and user is not on onboarding page, redirect to onboarding
    if (!isProfileCompleted && !isOnboarding && !request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup')) {
       // Allow login/signup/auth routes
       // But wait, if user IS logged in (user exists), they shouldn't be on login/signup usually, but if they are, we might want to let them be or redirect.
       // The requirement is: "After sign up... It need to make some Appear some other fields... And then Also after student... Register for That step"
       // So if they are logged in and incomplete, they MUST go to onboarding.
       // Unless they are logging out.
       return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // If profile is completed and user is on onboarding page, redirect to student dashboard
    if (isProfileCompleted && isOnboarding) {
      return NextResponse.redirect(new URL('/student', request.url))
    }
  } else {
    // If no user, redirect to login for protected routes
    if (request.nextUrl.pathname.startsWith('/student') || request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

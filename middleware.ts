import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const locales = ['fr', 'en']
const defaultLocale = 'fr'

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale

  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase())
    for (const locale of preferredLocales) {
      if (locales.includes(locale)) return locale
    }
  }
  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request)

  if (supabaseResponse.headers.get('location')) {
    return supabaseResponse
  }

  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return supabaseResponse
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return supabaseResponse

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  
  const redirectResponse = NextResponse.redirect(request.nextUrl)
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return redirectResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

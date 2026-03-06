export const config = {
  matcher: ['/', '/index.html'],
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');

    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [, password] = decoded.split(':');

      // Password is stored in Vercel environment variable
      if (password === process.env.SITE_PASSWORD) {
        // Auth successful - continue to the page
        return;
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SonicPure"',
      'Content-Type': 'text/plain',
    },
  });
}

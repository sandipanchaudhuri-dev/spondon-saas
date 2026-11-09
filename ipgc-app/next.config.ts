import type {NextConfig} from 'next'

// Permit only the existing, approved PujoVerse brand asset for optimized delivery.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'pujoverse.indianfestival.co.in', pathname: '/brand/pujoverse-unified-logo-v6.png' }],
  },
}
export default nextConfig

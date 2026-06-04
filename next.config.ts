import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config: {
    resolve?: {
      alias?: Record<string, unknown>
    }
  }) {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false
    }

    return config
  }
}

export default nextConfig

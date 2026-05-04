const nextConfig = {
  allowedDevOrigins: ['192.168.0.39'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ← Permite cualquier dominio HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // ← Permite cualquier dominio HTTP (menos seguro)
      },
    ],
  },
}

export default nextConfig;
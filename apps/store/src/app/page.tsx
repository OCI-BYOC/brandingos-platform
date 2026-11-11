export default function StorePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          BrandingOS Store
        </h1>
        <p className="text-white/60">Creator storefronts coming soon.</p>
        <p className="text-white/40 text-sm">
          Visit{" "}
          <code className="text-purple-400">/[username]/store</code> to see a creator's store.
        </p>
      </div>
    </main>
  )
}

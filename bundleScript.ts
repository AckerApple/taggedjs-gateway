import webpack from 'webpack'

export const run = (compiler: webpack.Compiler) => {
  console.debug('🌎📦 bundling...')
  return new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error('🌎📦 🔴 bundle error', {
          keys: Object.keys(err),
          details: (err as any).details,
          err
        })
        return rej({})
      }

      const compilation = stats?.compilation as webpack.Compilation

      if(compilation.errors.length) {
        const error = compilation.errors[0]
        const errors = (error.module as any)?._errors || (error.module?.getErrors?.())
        console.error('🌎📦 🔴 compilation bundle error',
          error.message,
          errors,
        )
        return rej({}/*error*/)
      }

      res(stats)

      const assets = compilation.assets
      console.debug('🌎📦 ✅ bundled sizes in kilobytes', Object.entries(assets).reduce((all, [name, value]) => {
        all[name] = value.size() / 1000
        return all
      },{} as Record<string, number>))
    })
  })
}

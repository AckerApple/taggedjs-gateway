export default class ResolveTsForJsPlugin {
  apply(compiler: any) {
    // Access the normal module factory
    compiler.hooks.normalModuleFactory.tap("ResolveTsForJsPlugin", (nmf: any) => {
      nmf.hooks.beforeResolve.tapAsync("ResolveTsForJsPlugin", (resolveData: any, callback: any) => {
        if (!resolveData) return callback();

        const isTsSourceFile = resolveData.contextInfo.issuer.search(/\.ts$/) > 0
        // Check if the request ends with '.js'
        if (isTsSourceFile && resolveData.request.endsWith('.js')) {
          // Change the request from .js to .ts without returning it
          resolveData.request = resolveData.request.replace(/\.js$/, '.ts');
        }

        // Continue the process without returning the object
        callback();
      });
    });
  }
}

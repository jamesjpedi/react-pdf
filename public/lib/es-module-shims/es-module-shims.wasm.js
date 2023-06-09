/* ES Module Shims Wasm 1.4.7 */
(function () {

  const noop = () => {};

  const optionsScript = document.querySelector('script[type=esms-options]');

  const esmsInitOptions = optionsScript ? JSON.parse(optionsScript.innerHTML) : self.esmsInitOptions ? self.esmsInitOptions : {};

  let shimMode = !!esmsInitOptions.shimMode;
  const resolveHook = globalHook(shimMode && esmsInitOptions.resolve);

  const skip = esmsInitOptions.skip ? new RegExp(esmsInitOptions.skip) : null;

  let nonce = esmsInitOptions.nonce;

  const mapOverrides = esmsInitOptions.mapOverrides;

  if (!nonce) {
    const nonceElement = document.querySelector('script[nonce]');
    if (nonceElement)
      nonce = nonceElement.nonce || nonceElement.getAttribute('nonce');
  }

  const onerror = globalHook(esmsInitOptions.onerror || noop);
  const onpolyfill = esmsInitOptions.onpolyfill ? globalHook(esmsInitOptions.onpolyfill) : () => console.info(`OK: ^ TypeError module failure has been polyfilled`);

  const { revokeBlobURLs, noLoadEventRetriggers, enforceIntegrity } = esmsInitOptions;

  const fetchHook = esmsInitOptions.fetch ? globalHook(esmsInitOptions.fetch) : fetch;

  function globalHook (name) {
    return typeof name === 'string' ? self[name] : name;
  }

  const enable = Array.isArray(esmsInitOptions.polyfillEnable) ? esmsInitOptions.polyfillEnable : [];
  const cssModulesEnabled = enable.includes('css-modules');
  const jsonModulesEnabled = enable.includes('json-modules');

  function setShimMode () {
    shimMode = true;
  }

  const edge = !!navigator.userAgent.match(/Edge\/\d+\.\d+/);

  const baseUrl = document.baseURI;

  function createBlob (source, type = 'text/javascript') {
    return URL.createObjectURL(new Blob([source], { type }));
  }

  const eoop = err => setTimeout(() => { throw err });

  const throwError = err => { (window.reportError || window.safari && console.error || eoop)(err), void onerror(err); };

  function isURL (url) {
    try {
      new URL(url);
      return true;
    }
    catch (_) {
      return false;
    }
  }

  const backslashRegEx = /\\/g;

  /*
   * Import maps implementation
   *
   * To make lookups fast we pre-resolve the entire import map
   * and then match based on backtracked hash lookups
   *
   */
  function resolveUrl (relUrl, parentUrl) {
    return resolveIfNotPlainOrUrl(relUrl, parentUrl) || (relUrl.indexOf(':') !== -1 ? relUrl : resolveIfNotPlainOrUrl('./' + relUrl, parentUrl));
  }

  function resolveIfNotPlainOrUrl (relUrl, parentUrl) {
    // strip off any trailing query params or hashes
    parentUrl = parentUrl && parentUrl.split('#')[0].split('?')[0];
    if (relUrl.indexOf('\\') !== -1)
      relUrl = relUrl.replace(backslashRegEx, '/');
    // protocol-relative
    if (relUrl[0] === '/' && relUrl[1] === '/') {
      return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
    }
    // relative-url
    else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) ||
        relUrl.length === 1  && (relUrl += '/')) ||
        relUrl[0] === '/') {
      const parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1);
      // Disabled, but these cases will give inconsistent results for deep backtracking
      //if (parentUrl[parentProtocol.length] !== '/')
      //  throw new Error('Cannot resolve');
      // read pathname from parent URL
      // pathname taken to be part after leading "/"
      let pathname;
      if (parentUrl[parentProtocol.length + 1] === '/') {
        // resolving to a :// so we need to read out the auth and host
        if (parentProtocol !== 'file:') {
          pathname = parentUrl.slice(parentProtocol.length + 2);
          pathname = pathname.slice(pathname.indexOf('/') + 1);
        }
        else {
          pathname = parentUrl.slice(8);
        }
      }
      else {
        // resolving to :/ so pathname is the /... part
        pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
      }

      if (relUrl[0] === '/')
        return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl;

      // join together and split for removal of .. and . segments
      // looping the string instead of anything fancy for perf reasons
      // '../../../../../z' resolved to 'x/y' is just 'z'
      const segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;

      const output = [];
      let segmentIndex = -1;
      for (let i = 0; i < segmented.length; i++) {
        // busy reading a segment - only terminate on '/'
        if (segmentIndex !== -1) {
          if (segmented[i] === '/') {
            output.push(segmented.slice(segmentIndex, i + 1));
            segmentIndex = -1;
          }
          continue;
        }
        // new segment - check if it is relative
        else if (segmented[i] === '.') {
          // ../ segment
          if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
            output.pop();
            i += 2;
            continue;
          }
          // ./ segment
          else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
            i += 1;
            continue;
          }
        }
        // it is the start of a new segment
        while (segmented[i] === '/') i++;
        segmentIndex = i; 
      }
      // finish reading out the last segment
      if (segmentIndex !== -1)
        output.push(segmented.slice(segmentIndex));
      return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
    }
  }

  function resolveAndComposeImportMap (json, baseUrl, parentMap) {
    const outMap = { imports: Object.assign({}, parentMap.imports), scopes: Object.assign({}, parentMap.scopes) };

    if (json.imports)
      resolveAndComposePackages(json.imports, outMap.imports, baseUrl, parentMap);

    if (json.scopes)
      for (let s in json.scopes) {
        const resolvedScope = resolveUrl(s, baseUrl);
        resolveAndComposePackages(json.scopes[s], outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}), baseUrl, parentMap);
      }

    return outMap;
  }

  function getMatch (path, matchObj) {
    if (matchObj[path])
      return path;
    let sepIndex = path.length;
    do {
      const segment = path.slice(0, sepIndex + 1);
      if (segment in matchObj)
        return segment;
    } while ((sepIndex = path.lastIndexOf('/', sepIndex - 1)) !== -1)
  }

  function applyPackages (id, packages) {
    const pkgName = getMatch(id, packages);
    if (pkgName) {
      const pkg = packages[pkgName];
      if (pkg === null) return;
      return pkg + id.slice(pkgName.length);
    }
  }


  function resolveImportMap (importMap, resolvedOrPlain, parentUrl) {
    let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes);
    while (scopeUrl) {
      const packageResolution = applyPackages(resolvedOrPlain, importMap.scopes[scopeUrl]);
      if (packageResolution)
        return packageResolution;
      scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf('/')), importMap.scopes);
    }
    return applyPackages(resolvedOrPlain, importMap.imports) || resolvedOrPlain.indexOf(':') !== -1 && resolvedOrPlain;
  }

  function resolveAndComposePackages (packages, outPackages, baseUrl, parentMap) {
    for (let p in packages) {
      const resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p;
      if ((!shimMode || !mapOverrides) && outPackages[resolvedLhs] && (outPackages[resolvedLhs] !== packages[resolvedLhs])) {
        throw Error(`Rejected map override "${resolvedLhs}" from ${outPackages[resolvedLhs]} to ${packages[resolvedLhs]}.`);
      }
      let target = packages[p];
      if (typeof target !== 'string')
        continue;
      const mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(target, baseUrl) || target, baseUrl);
      if (mapped) {
        outPackages[resolvedLhs] = mapped;
        continue;
      }
      console.warn(`Mapping "${p}" -> "${packages[p]}" does not resolve`);
    }
  }

  let supportsDynamicImportCheck = false;

  let dynamicImport;
  try {
    dynamicImport = (0, eval)('u=>import(u)');
    supportsDynamicImportCheck = true;
  }
  catch (e) {}

  if (!supportsDynamicImportCheck) {
    let err;
    window.addEventListener('error', _err => err = _err);
    dynamicImport = (url, { errUrl = url }) => {
      err = undefined;
      const src = createBlob(`import*as m from'${url}';self._esmsi=m;`);
      const s = Object.assign(document.createElement('script'), { type: 'module', src });
      s.setAttribute('noshim', '');
      s.setAttribute('nonce', nonce);
      document.head.appendChild(s);
      return new Promise((resolve, reject) => {
        s.addEventListener('load', () => {
          document.head.removeChild(s);
          if (self._esmsi) {
            resolve(self._esmsi, baseUrl);
            self._esmsi = null;
          }
          else {
            reject(err.error || new Error(`Error loading or executing the graph of ${errUrl} (check the console for ${src}).`));
            err = undefined;
          }
        });
      });
    };
  }

  // support browsers without dynamic import support (eg Firefox 6x)
  let supportsJsonAssertions = false;
  let supportsCssAssertions = false;

  let supportsImportMeta = false;
  let supportsImportMaps = false;

  let supportsDynamicImport = false;

  const featureDetectionPromise = Promise.resolve(supportsDynamicImportCheck).then(_supportsDynamicImport => {
    if (!_supportsDynamicImport)
      return;
    supportsDynamicImport = true;

    return Promise.all([
      dynamicImport(createBlob('import.meta')).then(() => supportsImportMeta = true, noop),
      cssModulesEnabled && dynamicImport(createBlob('import"data:text/css,{}"assert{type:"css"}')).then(() => supportsCssAssertions = true, noop),
      jsonModulesEnabled && dynamicImport(createBlob('import"data:text/json,{}"assert{type:"json"}')).then(() => supportsJsonAssertions = true, noop),
      new Promise(resolve => {
        self._$s = v => {
          document.head.removeChild(iframe);
          if (v) supportsImportMaps = true;
          delete self._$s;
          resolve();
        };
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.srcdoc = `<script type=importmap nonce="${nonce}">{"imports":{"x":"data:text/javascript,"}}<${''}/script><script nonce="${nonce}">import('x').then(()=>1,()=>0).then(v=>parent._$s(v))<${''}/script>`;
        document.head.appendChild(iframe);
      })
    ]);
  });

  /* es-module-lexer 0.10.0 */
  const A=1===new Uint8Array(new Uint16Array([1]).buffer)[0];function parse(E,g="@"){if(!C)return init.then(()=>parse(E));const I=E.length+1,o=(C.__heap_base.value||C.__heap_base)+4*I-C.memory.buffer.byteLength;o>0&&C.memory.grow(Math.ceil(o/65536));const D=C.sa(I-1);if((A?B:Q)(E,new Uint16Array(C.memory.buffer,D,I)),!C.parse())throw Object.assign(new Error(`Parse error ${g}:${E.slice(0,C.e()).split("\n").length}:${C.e()-E.lastIndexOf("\n",C.e()-1)}`),{idx:C.e()});const w=[],J=[];for(;C.ri();){const A=C.is(),Q=C.ie(),B=C.ai(),g=C.id(),I=C.ss(),o=C.se();let D;C.ip()&&(D=k(E.slice(-1===g?A-1:A,-1===g?Q+1:Q))),w.push({n:D,s:A,e:Q,ss:I,se:o,d:g,a:B});}for(;C.re();){const A=E.slice(C.es(),C.ee()),Q=A[0];J.push('"'===Q||"'"===Q?k(A):A);}function k(A){try{return (0,eval)(A)}catch(A){}}return [w,J,!!C.f()]}function Q(A,Q){const B=A.length;let C=0;for(;C<B;){const B=A.charCodeAt(C);Q[C++]=(255&B)<<8|B>>>8;}}function B(A,Q){const B=A.length;let C=0;for(;C<B;)Q[C]=A.charCodeAt(C++);}let C;const init=WebAssembly.compile((E="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ISEDC0EAKAKICiECAkAgA0H9AEYNACACIAFGDQUgAiEBIAJBACgCjApNDQEMBQsLQQAgAkECajYCiAoMAQtBACADQQJqNgKICkEBECEaQQAoAogKIgIgAhAmGgtBARAhIQILQQAoAogKIQMCQCACQeYARw0AIANBAmpBnghBBhAoDQBBACADQQhqNgKICiAAQQEQIRAiDwtBACADQX5qNgKICgwDCxAdDwsCQCADKQACQuyAhIOwjsA5Ug0AIAMvAQoQHkUNAEEAIANBCmo2AogKQQEQISECQQAoAogKIQMgAhAkGiADQQAoAogKEAJBAEEAKAKICkF+ajYCiAoPC0EAIANBBGoiAzYCiAoLQQAgA0EEaiICNgKICkEAQQA6AOQJA0BBACACQQJqNgKICkEBECEhA0EAKAKICiECAkAgAxAkQSByQfsARw0AQQBBACgCiApBfmo2AogKDwtBACgCiAoiAyACRg0BIAIgAxACAkBBARAhIgJBLEYNAAJAIAJBPUcNAEEAQQAoAogKQX5qNgKICg8LQQBBACgCiApBfmo2AogKDwtBACgCiAohAgwACwsPC0EAIANBCmo2AogKQQEQIRpBACgCiAohAwtBACADQRBqNgKICgJAQQEQISICQSpHDQBBAEEAKAKICkECajYCiApBARAhIQILQQAoAogKIQMgAhAkGiADQQAoAogKEAJBAEEAKAKICkF+ajYCiAoPCyADIANBDmoQAgurBgEEf0EAQQAoAogKIgBBDGoiATYCiAoCQAJAAkACQAJAAkACQAJAAkACQEEBECEiAkFZag4IAggBAgEBAQcACyACQSJGDQEgAkH7AEYNAgtBACgCiAogAUYNBwtBAC8B6gkNAUEAKAKICiECQQAoAowKIQMDQCACIANPDQQCQAJAIAIvAQAiAUEnRg0AIAFBIkcNAQsgACABECIPC0EAIAJBAmoiAjYCiAoMAAsLQQAoAogKIQJBAC8B6gkNAQJAA0ACQAJAAkAgAkEAKAKMCk8NAEEBECEiAkEiRg0BIAJBJ0YNASACQf0ARw0CQQBBACgCiApBAmo2AogKC0EBECEaQQAoAogKIgIpAABC5oDIg/CNwDZSDQZBACACQQhqNgKICkEBECEiAkEiRg0DIAJBJ0YNAwwGCyACEBcLQQBBACgCiApBAmoiAjYCiAoMAAsL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","undefined"!=typeof Buffer?Buffer.from(E,"base64"):Uint8Array.from(atob(E),A=>A.charCodeAt(0)))).then(WebAssembly.instantiate).then(({exports:A})=>{C=A;});var E;

  async function defaultResolve (id, parentUrl) {
    return resolveImportMap(importMap, resolveIfNotPlainOrUrl(id, parentUrl) || id, parentUrl);
  }

  async function _resolve (id, parentUrl) {
    const urlResolved = resolveIfNotPlainOrUrl(id, parentUrl);
    return {
      r: resolveImportMap(importMap, urlResolved || id, parentUrl),
      // b = bare specifier
      b: !urlResolved && !isURL(id)
    };
  }

  const resolve = resolveHook ? async (id, parentUrl) => ({ r: await resolveHook(id, parentUrl, defaultResolve), b: false }) : _resolve;

  const registry = {};

  async function loadAll (load, seen) {
    if (load.b || seen[load.u])
      return;
    seen[load.u] = 1;
    await load.L;
    await Promise.all(load.d.map(dep => loadAll(dep, seen)));
    if (!load.n)
      load.n = load.d.some(dep => dep.n);
  }

  let importMap = { imports: {}, scopes: {} };
  let importMapSrcOrLazy = false;
  let baselinePassthrough;

  const initPromise = featureDetectionPromise.then(() => {
    // shim mode is determined on initialization, no late shim mode
    if (!shimMode) {
      if (document.querySelectorAll('script[type=module-shim],script[type=importmap-shim],link[rel=modulepreload-shim]').length) {
        setShimMode();
      }
      else {
        let seenScript = false;
        for (const script of document.querySelectorAll('script[type=module],script[type=importmap]')) {
          if (!seenScript) {
            if (script.type === 'module')
              seenScript = true;
          }
          else if (script.type === 'importmap') {
            importMapSrcOrLazy = true;
            break;
          }
        }
      }
    }
    baselinePassthrough = supportsDynamicImport && supportsImportMeta && supportsImportMaps && (!jsonModulesEnabled || supportsJsonAssertions) && (!cssModulesEnabled || supportsCssAssertions) && !importMapSrcOrLazy && !false;
    if (shimMode || !baselinePassthrough) {
      new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type !== 'childList') continue;
          for (const node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT') {
              if (node.type === (shimMode ? 'module-shim' : 'module'))
                processScript(node);
              if (node.type === (shimMode ? 'importmap-shim' : 'importmap'))
                processImportMap(node);
            }
            else if (node.tagName === 'LINK' && node.rel === (shimMode ? 'modulepreload-shim' : 'modulepreload'))
              processPreload(node);
          }
        }
      }).observe(document, { childList: true, subtree: true });
      processImportMaps();
      processScriptsAndPreloads();
      return init;
    }
  });
  let importMapPromise = initPromise;
  let firstPolyfillLoad = true;
  let acceptingImportMaps = true;

  async function topLevelLoad (url, fetchOpts, source, nativelyLoaded, lastStaticLoadPromise) {
    if (!shimMode)
      acceptingImportMaps = false;
    await importMapPromise;
    // early analysis opt-out - no need to even fetch if we have feature support
    if (!shimMode && baselinePassthrough) {
      // for polyfill case, only dynamic import needs a return value here, and dynamic import will never pass nativelyLoaded
      if (nativelyLoaded)
        return null;
      await lastStaticLoadPromise;
      return dynamicImport(source ? createBlob(source) : url, { errUrl: url || source });
    }
    const load = getOrCreateLoad(url, fetchOpts, null, source);
    const seen = {};
    await loadAll(load, seen);
    lastLoad = undefined;
    resolveDeps(load, seen);
    await lastStaticLoadPromise;
    if (source && !shimMode && !load.n && !false) {
      const module = await dynamicImport(createBlob(source), { errUrl: source });
      if (revokeBlobURLs) revokeObjectURLs(Object.keys(seen));
      return module;
    }
    if (firstPolyfillLoad && !shimMode && load.n && nativelyLoaded) {
      onpolyfill();
      firstPolyfillLoad = false;
    }
    const module = await dynamicImport(!shimMode && !load.n && nativelyLoaded ? load.u : load.b, { errUrl: load.u });
    // if the top-level load is a shell, run its update function
    if (load.s)
      (await dynamicImport(load.s)).u$_(module);
    if (revokeBlobURLs) revokeObjectURLs(Object.keys(seen));
    // when tla is supported, this should return the tla promise as an actual handle
    // so readystate can still correspond to the sync subgraph exec completions
    return module;
  }

  function revokeObjectURLs(registryKeys) {
    let batch = 0;
    const keysLength = registryKeys.length;
    const schedule = self.requestIdleCallback ? self.requestIdleCallback : self.requestAnimationFrame;
    schedule(cleanup);
    function cleanup() {
      const batchStartIndex = batch * 100;
      if (batchStartIndex > keysLength) return
      for (const key of registryKeys.slice(batchStartIndex, batchStartIndex + 100)) {
        const load = registry[key];
        if (load) URL.revokeObjectURL(load.b);
      }
      batch++;
      schedule(cleanup);
    }
  }

  async function importShim (id, ...args) {
    // parentUrl if present will be the last argument
    let parentUrl = args[args.length - 1];
    if (typeof parentUrl !== 'string') {
      parentUrl = baseUrl;
    }
    // needed for shim check
    await initPromise;
    if (acceptingImportMaps || shimMode || !baselinePassthrough) {
      processImportMaps();
      if (!shimMode)
        acceptingImportMaps = false;
    }
    await importMapPromise;
    return topLevelLoad((await resolve(id, parentUrl)).r || throwUnresolved(id, parentUrl), { credentials: 'same-origin' });
  }

  self.importShim = importShim;

  if (shimMode) {
    importShim.getImportMap = () => JSON.parse(JSON.stringify(importMap));
  }

  const meta = {};

  async function importMetaResolve (id, parentUrl = this.url) {
    return (await resolve(id, `${parentUrl}`)).r || throwUnresolved(id, parentUrl);
  }

  self._esmsm = meta;

  function urlJsString (url) {
    return `'${url.replace(/'/g, "\\'")}'`;
  }

  let lastLoad;
  function resolveDeps (load, seen) {
    if (load.b || !seen[load.u])
      return;
    seen[load.u] = 0;

    for (const dep of load.d)
      resolveDeps(dep, seen);

    const [imports] = load.a;

    // "execution"
    const source = load.S;

    // edge doesnt execute sibling in order, so we fix this up by ensuring all previous executions are explicit dependencies
    let resolvedSource = edge && lastLoad ? `import '${lastLoad}';` : '';

    if (!imports.length) {
      resolvedSource += source;
    }
    else {
      // once all deps have loaded we can inline the dependency resolution blobs
      // and define this blob
      let lastIndex = 0, depIndex = 0;
      for (const { s: start, ss: statementStart, se: statementEnd, d: dynamicImportIndex } of imports) {
        // dependency source replacements
        if (dynamicImportIndex === -1) {
          const depLoad = load.d[depIndex++];
          let blobUrl = depLoad.b;
          if (!blobUrl) {
            // circular shell creation
            if (!(blobUrl = depLoad.s)) {
              blobUrl = depLoad.s = createBlob(`export function u$_(m){${
              depLoad.a[1].map(
                name => name === 'default' ? `$_default=m.default` : `${name}=m.${name}`
              ).join(',')
            }}${
              depLoad.a[1].map(name =>
                name === 'default' ? `let $_default;export{$_default as default}` : `export let ${name}`
              ).join(';')
            }\n//# sourceURL=${depLoad.r}?cycle`);
            }
          }
          // circular shell execution
          else if (depLoad.s) {
            resolvedSource += `${source.slice(lastIndex, start - 1)}/*${source.slice(start - 1, statementEnd)}*/${urlJsString(blobUrl)};import*as m$_${depIndex} from'${depLoad.b}';import{u$_ as u$_${depIndex}}from'${depLoad.s}';u$_${depIndex}(m$_${depIndex})`;
            lastIndex = statementEnd;
            depLoad.s = undefined;
            continue;
          }
          resolvedSource += `${source.slice(lastIndex, start - 1)}/*${source.slice(start - 1, statementEnd)}*/${urlJsString(blobUrl)}`;
          lastIndex = statementEnd;
        }
        // import.meta
        else if (dynamicImportIndex === -2) {
          meta[load.r] = { url: load.r, resolve: importMetaResolve };
          resolvedSource += `${source.slice(lastIndex, start)}self._esmsm[${urlJsString(load.r)}]`;
          lastIndex = statementEnd;
        }
        // dynamic import
        else {
          resolvedSource += `${source.slice(lastIndex, statementStart + 6)}Shim(${source.slice(start, statementEnd - 1)}, ${urlJsString(load.r)})`;
          lastIndex = statementEnd;
        }
      }

      resolvedSource += source.slice(lastIndex);
    }

    let hasSourceURL = false;
    resolvedSource = resolvedSource.replace(sourceMapURLRegEx, (match, isMapping, url) => (hasSourceURL = !isMapping, match.replace(url, () => new URL(url, load.r))));
    if (!hasSourceURL)
      resolvedSource += '\n//# sourceURL=' + load.r;

    load.b = lastLoad = createBlob(resolvedSource);
    load.S = undefined;
  }

  // ; and // trailer support added for Ruby on Rails 7 source maps compatibility
  // https://github.com/guybedford/es-module-shims/issues/228
  const sourceMapURLRegEx = /\n\/\/# source(Mapping)?URL=([^\n]+)\s*((;|\/\/[^#][^\n]*)\s*)*$/;

  const jsContentType = /^(text|application)\/(x-)?javascript(;|$)/;
  const jsonContentType = /^(text|application)\/json(;|$)/;
  const cssContentType = /^(text|application)\/css(;|$)/;

  const cssUrlRegEx = /url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g;

  // restrict in-flight fetches to a pool of 100
  let p = [];
  let c = 0;
  function pushFetchPool () {
    if (++c > 100)
      return new Promise(r => p.push(r));
  }
  function popFetchPool () {
    c--;
    if (p.length)
      p.shift()();
  }

  function fromParent (parent) {
    return parent ? ` imported from ${parent}` : '';
  }

  async function doFetch (url, fetchOpts, parent) {
    if (enforceIntegrity && !fetchOpts.integrity)
      throw Error(`No integrity for ${url}${fromParent(parent)}.`);
    const poolQueue = pushFetchPool();
    if (poolQueue) await poolQueue;
    try {
      var res = await fetchHook(url, fetchOpts);
    }
    catch (e) {
      e.message = `Unable to fetch ${url}${fromParent(parent)} - see network log for details.\n` + e.message;
      throw e;
    }
    finally {
      popFetchPool();
    }
    if (!res.ok)
      throw Error(`${res.status} ${res.statusText} ${res.url}${fromParent(parent)}`);
    return res;
  }

  async function fetchModule (url, fetchOpts, parent) {
    const res = await doFetch(url, fetchOpts, parent);
    const contentType = res.headers.get('content-type');
    if (jsContentType.test(contentType))
      return { r: res.url, s: await res.text(), t: 'js' };
    else if (jsonContentType.test(contentType))
      return { r: res.url, s: `export default ${await res.text()}`, t: 'json' };
    else if (cssContentType.test(contentType)) {
      return { r: res.url, s: `var s=new CSSStyleSheet();s.replaceSync(${
      JSON.stringify((await res.text()).replace(cssUrlRegEx, (_match, quotes = '', relUrl1, relUrl2) => `url(${quotes}${resolveUrl(relUrl1 || relUrl2, url)}${quotes})`))
    });export default s;`, t: 'css' };
    }
    else
      throw Error(`Unsupported Content-Type "${contentType}" loading ${url}${fromParent(parent)}. Modules must be served with a valid MIME type like application/javascript.`);
  }

  function getOrCreateLoad (url, fetchOpts, parent, source) {
    let load = registry[url];
    if (load && !source)
      return load;

    load = {
      // url
      u: url,
      // response url
      r: source ? url : undefined,
      // fetchPromise
      f: undefined,
      // source
      S: undefined,
      // linkPromise
      L: undefined,
      // analysis
      a: undefined,
      // deps
      d: undefined,
      // blobUrl
      b: undefined,
      // shellUrl
      s: undefined,
      // needsShim
      n: false,
      // type
      t: null
    };
    if (registry[url]) {
      let i = 0;
      while (registry[load.u + ++i]);
      load.u += i;
    }
    registry[load.u] = load;

    load.f = (async () => {
      if (!source) {
        // preload fetch options override fetch options (race)
        let t;
        ({ r: load.r, s: source, t } = await (fetchCache[url] || fetchModule(url, fetchOpts, parent)));
        if (t && !shimMode) {
          if (t === 'css' && !cssModulesEnabled || t === 'json' && !jsonModulesEnabled)
            throw Error(`${t}-modules require <script type="esms-options">{ "polyfillEnable": ["${t}-modules"] }<${''}/script>`);
          if (t === 'css' && !supportsCssAssertions || t === 'json' && !supportsJsonAssertions)
            load.n = true;
        }
      }
      try {
        load.a = parse(source, load.u);
      }
      catch (e) {
        console.warn(e);
        load.a = [[], []];
      }
      load.S = source;
      return load;
    })();

    load.L = load.f.then(async () => {
      let childFetchOpts = fetchOpts;
      load.d = (await Promise.all(load.a[0].map(async ({ n, d }) => {
        if (d >= 0 && !supportsDynamicImport || d === 2 && !supportsImportMeta)
          load.n = true;
        if (!n) return;
        const { r, b } = await resolve(n, load.r || load.u);
        if (b && (!supportsImportMaps || importMapSrcOrLazy))
          load.n = true;
        if (d !== -1) return;
        if (!r)
          throwUnresolved(n, load.r || load.u);
        if (skip && skip.test(r)) return { b: r };
        if (childFetchOpts.integrity)
          childFetchOpts = Object.assign({}, childFetchOpts, { integrity: undefined });
        return getOrCreateLoad(r, childFetchOpts, load.r).f;
      }))).filter(l => l);
    });

    return load;
  }

  function processScriptsAndPreloads () {
    for (const script of document.querySelectorAll(shimMode ? 'script[type=module-shim]' : 'script[type=module]'))
      processScript(script);
    for (const link of document.querySelectorAll(shimMode ? 'link[rel=modulepreload-shim]' : 'link[rel=modulepreload]'))
      processPreload(link);
  }

  function processImportMaps () {
    for (const script of document.querySelectorAll(shimMode ? 'script[type="importmap-shim"]' : 'script[type="importmap"]'))
      processImportMap(script);
  }

  function getFetchOpts (script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === 'use-credentials')
      fetchOpts.credentials = 'include';
    else if (script.crossorigin === 'anonymous')
      fetchOpts.credentials = 'omit';
    else
      fetchOpts.credentials = 'same-origin';
    return fetchOpts;
  }

  let lastStaticLoadPromise = Promise.resolve();

  let domContentLoadedCnt = 1;
  function domContentLoadedCheck () {
    if (--domContentLoadedCnt === 0 && !noLoadEventRetriggers)
      document.dispatchEvent(new Event('DOMContentLoaded'));
  }
  // this should always trigger because we assume es-module-shims is itself a domcontentloaded requirement
  document.addEventListener('DOMContentLoaded', async () => {
    await initPromise;
    domContentLoadedCheck();
    if (shimMode || !baselinePassthrough) {
      processImportMaps();
      processScriptsAndPreloads();
    }
  });

  let readyStateCompleteCnt = 1;
  if (document.readyState === 'complete') {
    readyStateCompleteCheck();
  }
  else {
    document.addEventListener('readystatechange', async () => {
      processImportMaps();
      await initPromise;
      readyStateCompleteCheck();
    });
  }
  function readyStateCompleteCheck () {
    if (--readyStateCompleteCnt === 0 && !noLoadEventRetriggers)
      document.dispatchEvent(new Event('readystatechange'));
  }

  function processImportMap (script) {
    if (script.ep) // ep marker = script processed
      return;
    // empty inline scripts sometimes show before domready
    if (!script.src && !script.innerHTML)
      return;
    script.ep = true;
    // we dont currently support multiple, external or dynamic imports maps in polyfill mode to match native
    if (script.src) {
      if (!shimMode)
        return;
      importMapSrcOrLazy = true;
    }
    if (acceptingImportMaps) {
      importMapPromise = importMapPromise
        .then(async () => {
          importMap = resolveAndComposeImportMap(script.src ? await (await doFetch(script.src, getFetchOpts(script))).json() : JSON.parse(script.innerHTML), script.src || baseUrl, importMap);
        })
        .catch(throwError);
      if (!shimMode)
        acceptingImportMaps = false;
    }
  }

  function processScript (script) {
    if (script.ep) // ep marker = script processed
      return;
    if (script.getAttribute('noshim') !== null)
      return;
    // empty inline scripts sometimes show before domready
    if (!script.src && !script.innerHTML)
      return;
    script.ep = true;
    // does this load block readystate complete
    const isReadyScript = readyStateCompleteCnt > 0;
    // does this load block DOMContentLoaded
    const isDomContentLoadedScript = domContentLoadedCnt > 0;
    if (isReadyScript) readyStateCompleteCnt++;
    if (isDomContentLoadedScript) domContentLoadedCnt++;
    const blocks = script.getAttribute('async') === null && isReadyScript;
    const loadPromise = topLevelLoad(script.src || baseUrl, getFetchOpts(script), !script.src && script.innerHTML, !shimMode, blocks && lastStaticLoadPromise).catch(throwError);
    if (blocks)
      lastStaticLoadPromise = loadPromise.then(readyStateCompleteCheck);
    if (isDomContentLoadedScript)
      loadPromise.then(domContentLoadedCheck);
  }

  const fetchCache = {};
  function processPreload (link) {
    if (link.ep) // ep marker = processed
      return;
    link.ep = true;
    if (fetchCache[link.href])
      return;
    fetchCache[link.href] = fetchModule(link.href, getFetchOpts(link));
  }

  function throwUnresolved (id, parentUrl) {
    throw Error(`Unable to resolve specifier '${id}'${fromParent(parentUrl)}`);
  }

})();

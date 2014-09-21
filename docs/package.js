(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "os_client\n=========\n\nOS system call client API for use in web workers\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "OS Client\n=========\n\nClient system call wrapper for worker programs.\n\n    module.exports =\n      Process: require \"./process\"\n      File: require \"./file\"\n",
      "mode": "100644"
    },
    "process.coffee.md": {
      "path": "process.coffee.md",
      "content": "Process\n=======\n\n    inputId = 0\n\n    messageBause = ->\n      \"P#{inputId += 1}\"\n\n    module.exports =\n      spawn: (path, args=[], env={}) ->\n        channelId = messageBause()\n        postMessage\n          type: \"SYS\"\n          message:\n            method: \"spawn\"\n            args: [\n              path\n              channelId\n              args\n              env\n            ]\n\n        outHandler = null\n\n        addEventListener \"message\", ({data}) ->\n          {channelId, type, message} = data\n\n          if cid is channelId\n            switch type\n              when \"STDOUT\"\n                outHandler?(data)\n              when \"STDERR\"\n                errHandler?(data)\n\n        STDIN: (data) ->\n          postMessage\n            cid: channelId\n            type: \"STDIN\"\n            message: data\n\n        STDOUT: (handler) ->\n          outHandler = handler\n        STDERR: (handler) ->\n          errHandler = handler\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.0.0\"\n",
      "mode": "100644"
    },
    "file.coffee.md": {
      "path": "file.coffee.md",
      "content": "File\n====\n\nI guess this is where we try to be a file system?\n",
      "mode": "100644"
    },
    "test/test.coffee": {
      "path": "test/test.coffee",
      "content": "OS = require \"../main\"\n\ndescribe \"OS Client\", ->\n  it \"should do some stuff maybe\", ->\n    assert OS\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  module.exports = {\n    Process: require(\"./process\"),\n    File: require(\"./file\")\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "process": {
      "path": "process",
      "content": "(function() {\n  var inputId, messageBause;\n\n  inputId = 0;\n\n  messageBause = function() {\n    return \"P\" + (inputId += 1);\n  };\n\n  module.exports = {\n    spawn: function(path, args, env) {\n      var channelId, outHandler;\n      if (args == null) {\n        args = [];\n      }\n      if (env == null) {\n        env = {};\n      }\n      channelId = messageBause();\n      postMessage({\n        type: \"SYS\",\n        message: {\n          method: \"spawn\",\n          args: [path, channelId, args, env]\n        }\n      });\n      outHandler = null;\n      addEventListener(\"message\", function(_arg) {\n        var data, message, type;\n        data = _arg.data;\n        channelId = data.channelId, type = data.type, message = data.message;\n        if (cid === channelId) {\n          switch (type) {\n            case \"STDOUT\":\n              return typeof outHandler === \"function\" ? outHandler(data) : void 0;\n            case \"STDERR\":\n              return typeof errHandler === \"function\" ? errHandler(data) : void 0;\n          }\n        }\n      });\n      return {\n        STDIN: function(data) {\n          return postMessage({\n            cid: channelId,\n            type: \"STDIN\",\n            message: data\n          });\n        },\n        STDOUT: function(handler) {\n          return outHandler = handler;\n        },\n        STDERR: function(handler) {\n          var errHandler;\n          return errHandler = handler;\n        }\n      };\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.0.0\"};",
      "type": "blob"
    },
    "file": {
      "path": "file",
      "content": "(function() {\n\n\n}).call(this);\n",
      "type": "blob"
    },
    "test/test": {
      "path": "test/test",
      "content": "(function() {\n  var OS;\n\n  OS = require(\"../main\");\n\n  describe(\"OS Client\", function() {\n    return it(\"should do some stuff maybe\", function() {\n      return assert(OS);\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.0.0",
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/os_client",
    "homepage": null,
    "description": "OS system call client API for use in web workers",
    "html_url": "https://github.com/STRd6/os_client",
    "url": "https://api.github.com/repos/STRd6/os_client",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});
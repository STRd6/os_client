window["STRd6/os_client:master"]({
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
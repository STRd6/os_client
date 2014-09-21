Process
=======

    inputId = 0

    messageBause = ->
      "P#{inputId += 1}"

    module.exports =
      spawn: (path, args=[], env={}) ->
        channelId = messageBause()
        postMessage
          type: "SYS"
          message:
            method: "spawn"
            args: [
              path
              channelId
              args
              env
            ]

        outHandler = null

        addEventListener "message", ({data}) ->
          {channelId, type, message} = data

          if cid is channelId
            switch type
              when "STDOUT"
                outHandler?(data)
              when "STDERR"
                errHandler?(data)

        STDIN: (data) ->
          postMessage
            cid: channelId
            type: "STDIN"
            message: data

        STDOUT: (handler) ->
          outHandler = handler
        STDERR: (handler) ->
          errHandler = handler

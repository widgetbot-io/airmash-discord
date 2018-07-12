    function connect() {
      const channels = {
        'eu-s1': {
          'ffa1': '466972747831050251',
          'ffa2': '466972762930544640',
          'ctf1': '466972786464915486',
          'btr1': '466972810141499403'
        },
        'us-s1': {
          'ffa1': '466972824641339392',
          'ffa2': '466972839321534464',
          'ctf1': '466972857604505600',
          'btr1': '466972869952274432'
        },
        'asia-s1': {
          'ffa1': '466972883533561858',
          'ffa2': '466972893431988234',
          'ctf1': '466972903229882369',
          'btr1': '466972918262530049'
        }
      }

      const getChannel = () => channels[game.playHost][game.playPath]

      const css = String.raw
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3'

      script.onload = () => {
        const crate = new Crate({
          server: '466972350353637396',
          channel: getChannel(),
          color: '#000000',
          notifications: false,
          indicator: false,
          location: [0, 2],
          css: css`
            .button {
              background: transparent;
              box-shadow: none;
            }
          `
        })

        crate.on('message', ({ channel, message }) => {
          if (channel !== getChannel()) return
          addMessage(message.author.name, message.content, message.author.id, message.author.avatar)
        })
      }
      document.head.appendChild(script)

      function addMessage(name, message, id, avatar) {
        UI.addChatLine({ id, name }, message, 0);

        const styles = $(`
          <style>
            .playersel[data-playerid="${id}"] .flag {
              background: url(${avatar});
              background-size: 100%;
              background-repeat: no-repeat;
              background-position: center;
              border-radius: 10px;
              height: 20px;
            }
          </style>
        `)

        $('html > head').append(styles)
      }

      // Overwrite funcs
      if (UI.realparseCommand === undefined) {
        UI.realparseCommand = UI.parseCommand;
        UI.parseCommand = function (message) {
          if (message.startsWith('/')) {
            return UI.realparseCommand(message);
          }
          if (message.startsWith('~')) {
            return UI.realparseCommand(message.slice(1));
          }

          crate.emit('sendMessage', { channel: getChannel(), message })
          return true
        }
      }

      // Add CSS
      {
        $('html > head').append($(`
          <style>
            #logosmall {
              display: none !important
            }

            #menu,
            #gameselector {
              left: 89px !important;
            }

            .playersel[data-playerid="discord"] {
              background: #7289DA;
              font-size: 10px;
            }
          </style>
        `))
      }
    }

    SWAM.on("gamePrep", connect);

    SWAM.registerExtension({
      name: "Discord Chat",
      id: "discordchat",
      description: "Discord integration for airma.sh",
      version: "1",
      author: "samdenty99"
    });

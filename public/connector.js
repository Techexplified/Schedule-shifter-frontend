/* global window */
const ICON = 'https://cdn-icons-png.flaticon.com/512/747/747310.png';

window.TrelloPowerUp.initialize({
  'board-buttons': function () {
    return [
      {
        icon: {
          light: ICON,
          dark: ICON
        },
        text: 'Schedule Shifter',
        callback: function (t) {
          return t.modal({
            title: 'Schedule Shifter',
            url: './index.html?trello=true',
            accentColor: '#0065FF',
            height: 640,
            fullscreen: false,
            actions: [
              {
                icon: ICON,
                alt: 'Close',
                position: 'right',
                callback: function (tClose) {
                  return tClose.closeModal();
                }
              }
            ]
          });
        }
      }
    ];
  },
  'card-buttons': function () {
    return [
      {
        icon: ICON,
        text: 'Shift Schedule',
        callback: function (t) {
          return t.modal({
            title: 'Schedule Shifter',
            url: './index.html?trello=true',
            accentColor: '#0065FF',
            height: 640,
            fullscreen: false
          });
        }
      }
    ];
  }
});

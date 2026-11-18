/* global window */
const ICON_URL = 'https://schedule-shifter-frontend.vercel.app/calendar-icon.svg';
const MODAL_URL = 'https://schedule-shifter-frontend.vercel.app/?trello=true';

window.TrelloPowerUp.initialize({
  'board-buttons': function () {
    return [
      {
        icon: {
          light: ICON_URL,
          dark: ICON_URL
        },
        text: 'Schedule Shifter',
        callback: function (t) {
          return t.modal({
            title: 'Schedule Shifter',
            url: MODAL_URL,
            accentColor: '#0065FF',
            height: 640,
            fullscreen: false,
            actions: [
              {
                icon: ICON_URL,
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
        icon: ICON_URL,
        text: 'Shift Schedule',
        callback: function (t) {
          return t.modal({
            title: 'Schedule Shifter',
            url: MODAL_URL,
            accentColor: '#0065FF',
            height: 640,
            fullscreen: false
          });
        }
      }
    ];
  }
});

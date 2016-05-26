'use strict'

var r = require('rethinkdb');
var connection = null;

r.connect( {host: 'localhost', port: 28015}).then((result) => {
  connection = result;
  r.db('test').tableCreate('chat').run(connection, function(err, result) {
      if (err) throw err;
      console.log(JSON.stringify(result, null, 2));
  })
  r.table('chat').changes().run(connection).then(function(cursor) {
      cursor.each(function(err, row) {
          app.messagesUpdate(row.new_val)
      });
  });
 });

const app = new Vue({

  el: '#app',
  data: {
    newMessage: '',
    avatar_url: `http://api.adorable.io/avatars/50/${new Date().getMilliseconds()}.png`,
    messages: [],
  },

  methods: {
    addMessage: function() {
      var text = this.newMessage.trim();
      if (text) {
        r.table('chat').insert({
          text: text,
          datetime: new Date(),
          url: this.avatar_url,
        }).run(connection);
        this.newMessage = '';
      }
    },

    messagesUpdate: function(newMessages) {
      this.messages.push(newMessages);
    },
  },
});

// Image preloading
const image = new Image();
image.src = app.avatar_url;

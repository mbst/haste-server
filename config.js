{

  "host": "0.0.0.0",
  "port": 7777,

  "auth": {
    "type": "none",
    "users": {
      "test": "test",
      "foo": "bar"
    }
  },

  "keyLength": 10,

  "maxLength": 4000000,

  "staticMaxAge": 86400,

  "recompressStaticAssets": true,

  "logging": [
    {
      "level": "verbose",
      "type": "Console",
      "colorize": true
    }
  ],

  "keyGenerator": {
    "type": "phonetic"
  },

  "storage": {
    "type" : "file",
    "path" : "./data"
  },

  "documents": {
    "about": "./about.md"
  }

}

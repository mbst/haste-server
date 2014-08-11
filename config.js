{

  "host": "0.0.0.0",
  "port": 7777,

  "auth": {
    "type": "none",
    "ipwhitelist": [],
    "users": {
      "test": "test"
    }
  },

  "keyLength": 10,

  "maxLength": 4000000,

  "staticMaxAge": 86400,

  "recompressStaticAssets": false,

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

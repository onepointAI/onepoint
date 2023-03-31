module.exports = {
    "packagerConfig": {
        "name": "Electron starter",
        "executableName": "electron-starter",
        "icon": "assets/icon",
        "extraResource": [
          "assets"
        ]
    },
    // plugins: [
    //     [
    //         {
    //             name: '@electron-forge/plugin-webpack',
    //             config: {
    //                 "mainConfig": "./webpack/main.webpack.js",
    //                 "renderer": {
    //                   "config": "./webpack/renderer.webpack.js",
    //                   "entryPoints": [
    //                     {
    //                       "html": "./public/index.html",
    //                       "js": "./src/index.tsx",
    //                       "name": "main_window",
    //                       "preload": {
    //                         "js": "./electron/bridge.ts"
    //                       }
    //                     }
    //                   ]
    //                 }
    //             }
    //         },
    //     ]
    //   ],

      plugins: [
        {
            name: '@electron-forge/plugin-webpack',
            config: {
                mainConfig: "./webpack/main.webpack.js",
                renderer: {
                    "config": "./webpack/renderer.webpack.js",
                    entryPoints: [
                        {
                            "html": "./public/index.html",
                            "js": "./src/index.tsx",
                            "name": "main_window",
                            "preload": {
                            "js": "./electron/bridge.ts"
                            }
                        }
                    ],
                },
            },
        },
    ],
      "makers": [
        {
          "name": "@electron-forge/maker-squirrel",
          "config": {
            "name": "Electron Starter"
          }
        },
        {
          "name": "@electron-forge/maker-zip",
          "platforms": [
            "darwin"
          ]
        },
        {
          "name": "@electron-forge/maker-deb",
          "config": {}
        },
        {
          "name": "@electron-forge/maker-rpm",
          "config": {}
        }
      ]
}

# Generic Sharing of a Webpage

## What is it?

This plugin is one of the official BigBlueButton plugins. It basically opens up a link that the presenter wants. That might be a video, a document, or anything that supports being rendered in an iFrame.

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-generic-link-share
npm ci
npm run build-bundle
```

The above commands will generate the `dist` folder, containing the bundled JavaScript file named `GenericLinkShare.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the plugin separated from the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in the `.properties` file from `bbb-web` in `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties`


## Development mode

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`

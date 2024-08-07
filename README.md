# Generic Sharing of a Webpage

## What is it?

This plugin is one of the official BigBlueButton plugins. It basically opens up a link that the presenter wants. That might be a video, a document, or anything that supports being rendered in an iFrame.

## Running the Plugin from Source

1. Start the development server:

```bash
cd $HOME/src/plugin-generic-link-share
npm install
npm start
```

2. Add reference to it on BigBlueButton's `settings.yml`:

```yaml
  plugins:
    - name: GenericLinkShare
      url: http://127.0.0.1:4701/static/GenericLinkShare.js
      dataChannels:
        - name: urlToGenericLink
          pushPermission: ['moderator','presenter']
          replaceOrDeletePermission: ['moderator', 'creator']
```

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-generic-link-share
npm install
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `DecreaseVolumeOnSpeak.js`. This file can be hosted on any HTTPS server.

To use the plugin with BigBlueButton, add the plugin's URL to `settings.yml` as shown below:

```yaml
public:
  app:
    ... // All app configurations
  plugins:
    - name: GenericLinkShare
      url: <<PLUGIN_URL>>
      dataChannels:
        - name: urlToGenericLink
          pushPermission: ['moderator','presenter']
          replaceOrDeletePermission: ['moderator', 'creator']
  ... // All other configurations
```

Alternatively, you can host the bundled file on the BigBlueButton server by copying `dist/GenericLinkShare.js` to the folder `/var/www/bigbluebutton-default/assets/plugins`. In this case, the `<<PLUGIN_URL>>` will be `https://<your-host>/plugins/GenericLinkShare.js`.

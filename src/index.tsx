import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import GenericLinkShare from './components/generic-link-share/component';

const uuid = document.currentScript?.getAttribute('uuid') || 'root';

const pluginName = document.currentScript?.getAttribute('pluginName') || 'plugin';

const root = ReactDOM.createRoot(document.getElementById(uuid));
root.render(
  <GenericLinkShare {...{
    pluginUuid: uuid,
    pluginName,
  }}
  />,
);

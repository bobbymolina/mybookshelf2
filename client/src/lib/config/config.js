import {
  inject,
  LogManager
} from 'aurelia-framework';

import config from 'config/config';

let logger = LogManager.getLogger('config');

export class Configure {
  _config = config;
  constructor(loader) {
  }

  get(key, defval = undefined) {
    var parent = this._config;
    for (var k of key.split('.')) {
      if (parent.hasOwnProperty(k) && parent[k]) {
        parent = parent[k];
      } else {
        return defval;
      };
    }
    return parent;
  }

}

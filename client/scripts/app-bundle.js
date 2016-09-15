define('app',['exports', 'aurelia-auth', 'aurelia-framework', 'aurelia-fetch-client', 'lib/config/index', 'lib/ws-client', 'lib/access', 'routes'], function (exports, _aureliaAuth, _aureliaFramework, _aureliaFetchClient, _index, _wsClient, _access, _routes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('app');
  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_index.Configure, _aureliaAuth.FetchConfig, _aureliaFetchClient.HttpClient, _wsClient.WSClient, _access.Access), _dec(_class = function () {
    function App(config, fetchConfig, client, wsClient, access) {
      var _this = this;

      _classCallCheck(this, App);

      this.config = config;
      this.access = access;
      fetchConfig.configure();
      client.configure(function (conf) {
        return conf.withBaseUrl('http://' + _this.config.get('api.host', window.location.hostname) + ':' + _this.config.get('api.port', 80)).withInterceptor({
          response: function response(_response) {
            if (_response && _response.status == 401) {
              logger.warn('Not authenticated!');
              _this.router.navigateToRoute('login');
              throw new Error('Not autherticated!');
            } else if (_response && _response.status >= 300) throw new Error('HTTP error ' + _response.status);
            return _response;
          }
        });
      });
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'MyBookshelf2';
      config.addPipelineStep('authorize', _aureliaAuth.AuthorizeStep);
      config.map(_routes.ROUTES);

      this.router = router;
    };

    App.prototype.activate = function activate() {
      this.access.signalState();
    };

    App.prototype.isAuthenticated = function isAuthenticated() {
      return this.access.authenticated;
    };

    App.prototype.doSearch = function doSearch(query) {
      this.router.navigateToRoute('search', {
        query: encodeURIComponent(query)
      });
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', 'config/auth-config', 'bootstrap', 'bootstrap-drawer'], function (exports, _environment, _authConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _authConfig2 = _interopRequireDefault(_authConfig);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });
  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('components/pagination').plugin('aurelia-auth', function (baseConfig) {
      return baseConfig.configure(_authConfig2.default);
    }).feature('lib/config').plugin('aurelia-dialog', function (config) {
      config.useDefaults();
      config.settings.lock = false;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 1045;
    });

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot('app');
    });
  }
});
define('pub-app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Login to MyBookshelf2';
      config.map([{ route: ['login', ''], name: 'login', moduleId: 'pages/login', title: 'Login' }]);

      this.router = router;
    };

    return App;
  }();
});
define('routes',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ROUTES = exports.ROUTES = [{
    route: ['', 'welcome'],
    name: 'welcome',
    moduleId: 'pages/welcome',
    title: 'Welcome'
  }, {
    route: 'ebooks',
    name: 'ebooks',
    moduleId: 'pages/ebooks',
    nav: true,
    title: 'Ebooks',
    auth: true
  }, {
    route: 'login',
    name: 'login',
    moduleId: 'pages/login',
    title: 'Login'
  }, {
    route: 'ebook/:id',
    name: 'ebook',
    moduleId: 'pages/ebook',
    title: 'Ebook',
    auth: true
  }, {
    route: 'search/:query',
    name: 'search',
    moduleId: 'pages/search',
    title: 'Search Results',
    auth: true
  }, {
    route: ['author/:id'],
    name: 'author',
    moduleId: 'pages/author',
    title: 'Authors books',
    auth: true
  }, {
    route: 'upload',
    name: 'upload',
    moduleId: 'pages/upload',
    title: 'Upload Ebook',
    nav: true,
    auth: true
  }, {
    route: 'upload-result/:id',
    name: 'upload-result',
    moduleId: 'pages/upload-result',
    title: 'Upload results',
    auth: true
  }, {
    route: 'ebook-edit/:id',
    name: 'ebook-edit',
    moduleId: 'pages/ebook-edit',
    title: 'Edit Ebook',
    auth: true
  }, {
    route: 'ebook-create',
    name: 'ebook-create',
    moduleId: 'pages/ebook-edit',
    title: 'Create Ebook',
    auth: true
  }, {
    route: 'test',
    name: 'test',
    moduleId: 'test/test-page',
    title: 'Just testing'
  }];
});
define('config/auth-config',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var configForDevelopment = {
        loginUrl: '/login',
        providers: {
            google: {
                clientId: '239531826023-ibk10mb9p7ull54j55a61og5lvnjrff6.apps.googleusercontent.com'
            },

            linkedin: {
                clientId: '778mif8zyqbei7'
            },
            facebook: {
                clientId: '1452782111708498'
            }
        }
    };

    var configForProduction = {
        loginUrl: '/login',
        providers: {
            google: {
                clientId: '239531826023-3ludu3934rmcra3oqscc1gid3l9o497i.apps.googleusercontent.com'
            },

            linkedin: {
                clientId: '7561959vdub4x1'
            },
            facebook: {
                clientId: '1653908914832509'
            }

        }
    };
    var config;
    if (window.location.hostname === 'localhost') {
        config = configForDevelopment;
    } else {
        config = configForProduction;
    }

    exports.default = config;
});
define('config/config',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var config = {
    "version": "0.1",
    "debug": true,
    "api": {
      "host": "",
      "port": 6006,
      "path": "/api"
    },
    "wamp": {
      "host": "",
      "port": 8080,
      "path": "/ws",
      "realm": "realm1"
    },
    "maxUploadSize": 104857600,
    "notificationAttentionTimeout": 20
  };

  exports.default = config;
});
define('components/author',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Author = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Author = exports.Author = (_dec = (0, _aureliaFramework.customElement)('author'), _dec2 = (0, _aureliaFramework.computedFrom)('author'), _dec3 = (0, _aureliaFramework.computedFrom)('author'), _dec(_class = (_class2 = function () {
    function Author() {
      _classCallCheck(this, Author);

      _initDefineProp(this, 'author', _descriptor, this);

      _initDefineProp(this, 'last', _descriptor2, this);

      _initDefineProp(this, 'linked', _descriptor3, this);
    }

    _createClass(Author, [{
      key: 'link',
      get: function get() {

        return '#/author/' + this.author.id;
      }
    }, {
      key: 'fullName',
      get: function get() {
        return this.author.first_name ? this.author.first_name + ' ' + this.author.last_name : this.author.last_name;
      }
    }]);

    return Author;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'author', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'last', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'linked', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, 'link', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'link'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'fullName', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'fullName'), _class2.prototype)), _class2)) || _class);
});
define('components/authors-converter',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthorsValueConverter = exports.AuthorsValueConverter = function () {
    function AuthorsValueConverter() {
      _classCallCheck(this, AuthorsValueConverter);
    }

    AuthorsValueConverter.prototype.toView = function toView(val) {
      if (!val) return '';
      return val.map(function (a) {
        return a.firstname ? a.firstname + ' ' + a.lastname : a.lastname;
      }).join(', ');
    };

    return AuthorsValueConverter;
  }();
});
define('components/authors-edit',['exports', 'aurelia-framework', 'lib/api-client', 'jquery'], function (exports, _aureliaFramework, _apiClient, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorsEdit = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var logger = _aureliaFramework.LogManager.getLogger('authors-edit');

  var AuthorsEdit = exports.AuthorsEdit = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient), _dec(_class = (_class2 = function () {
    function AuthorsEdit(client) {
      _classCallCheck(this, AuthorsEdit);

      _initDefineProp(this, 'authors', _descriptor, this);

      this.client = client;
    }

    AuthorsEdit.prototype.getFullName = function getFullName(item) {
      var name = item.first_name ? item.last_name + ', ' + item.first_name : item.last_name;

      return name;
    };

    AuthorsEdit.prototype.addAuthor = function addAuthor() {
      var _this = this;

      var addIfNotExists = function addIfNotExists(author) {
        for (var _iterator = _this.authors, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var item = _ref;

          if (item.last_name === author.last_name && item.first_name === author.first_name) return;
        }
        _this.authors.push(author);
        _this._author = '';
      };

      if (!this.authors) this.authors = [];
      if (this._authorSelected) {
        addIfNotExists(this._authorSelected);
      } else if (this._author) {
        addIfNotExists(this.splitFullName(this._author));
      }
    };

    AuthorsEdit.prototype.removeAuthor = function removeAuthor(selected) {
      if (selected !== undefined) this.authors.splice(selected, 1);
    };

    AuthorsEdit.prototype.splitFullName = function splitFullName(name) {
      var parts = name.split(',').map(function (x) {
        return x.trim();
      });
      var splittedName = { last_name: parts[0] };
      if (parts.length > 1) splittedName.first_name = parts.slice(1).join(' ');
      return splittedName;
    };

    _createClass(AuthorsEdit, [{
      key: 'loaderAuthors',
      get: function get() {
        var _this2 = this;

        return function (start) {
          return _this2.client.getIndex('authors', start);
        };
      }
    }, {
      key: 'authorsVisible',
      get: function get() {
        if (this.authors && this.authors.length) {
          return this.authors.map(this.getFullName);
        }
      }
    }]);

    return AuthorsEdit;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'authors', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('components/authors',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authors = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

  var Authors = exports.Authors = (_dec = (0, _aureliaFramework.computedFrom)('authors', 'compact'), (_class = function () {
    function Authors() {
      _classCallCheck(this, Authors);

      _initDefineProp(this, 'authors', _descriptor, this);

      _initDefineProp(this, 'compact', _descriptor2, this);

      _initDefineProp(this, 'linked', _descriptor3, this);
    }

    _createClass(Authors, [{
      key: 'many',
      get: function get() {
        if (!this.authors) return false;
        return this.authors.length > 2 && this.compact;
      }
    }]);

    return Authors;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'authors', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'compact', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'linked', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class.prototype, 'many', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'many'), _class.prototype)), _class));
});
define('components/blur-image',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BlurImageCustomAttribute = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var BlurImageCustomAttribute = exports.BlurImageCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
		function BlurImageCustomAttribute(element) {
			_classCallCheck(this, BlurImageCustomAttribute);

			this.element = element;
		}

		BlurImageCustomAttribute.prototype.valueChanged = function valueChanged(newImage) {
			var _this = this;

			if (newImage.complete) {
				drawBlur(this.element, newImage);
			} else {
				newImage.onload = function () {
					return drawBlur(_this.element, newImage);
				};
			}
		};

		return BlurImageCustomAttribute;
	}()) || _class);


	var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

	var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

	var BLUR_RADIUS = 40;

	function stackBlurCanvasRGBA(canvas, top_x, top_y, width, height, radius) {
		if (isNaN(radius) || radius < 1) return;
		radius |= 0;

		var context = canvas.getContext("2d");
		var imageData;

		try {
			imageData = context.getImageData(top_x, top_y, width, height);
		} catch (e) {
			throw new Error("unable to access image data: " + e);
		}

		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;

		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1 = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1 = radius + 1;
		var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

		var stackStart = new BlurStack();
		var stack = stackStart;
		for (i = 1; i < div; i++) {
			stack = stack.next = new BlurStack();
			if (i == radiusPlus1) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;

		yw = yi = 0;

		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];

		for (y = 0; y < height; y++) {
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			for (i = 1; i < radiusPlus1; i++) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
				b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
				a_sum += (stack.a = pa = pixels[p + 3]) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;
			}

			stackIn = stackStart;
			stackOut = stackEnd;
			for (x = 0; x < width; x++) {
				pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
				if (pa != 0) {
					pa = 255 / pa;
					pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
					pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
					pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

				r_in_sum += stackIn.r = pixels[p];
				g_in_sum += stackIn.g = pixels[p + 1];
				b_in_sum += stackIn.b = pixels[p + 2];
				a_in_sum += stackIn.a = pixels[p + 3];

				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;

				stackIn = stackIn.next;

				r_out_sum += pr = stackOut.r;
				g_out_sum += pg = stackOut.g;
				b_out_sum += pb = stackOut.b;
				a_out_sum += pa = stackOut.a;

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		for (x = 0; x < width; x++) {
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

			yi = x << 2;
			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			yp = width;

			for (i = 1; i <= radius; i++) {
				yi = yp + x << 2;

				r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
				b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
				a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;

				if (i < heightMinus1) {
					yp += width;
				}
			}

			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for (y = 0; y < height; y++) {
				p = yi << 2;
				pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
				if (pa > 0) {
					pa = 255 / pa;
					pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
					pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
					pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
				} else {
					pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

				r_sum += r_in_sum += stackIn.r = pixels[p];
				g_sum += g_in_sum += stackIn.g = pixels[p + 1];
				b_sum += b_in_sum += stackIn.b = pixels[p + 2];
				a_sum += a_in_sum += stackIn.a = pixels[p + 3];

				stackIn = stackIn.next;

				r_out_sum += pr = stackOut.r;
				g_out_sum += pg = stackOut.g;
				b_out_sum += pb = stackOut.b;
				a_out_sum += pa = stackOut.a;

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += width;
			}
		}

		context.putImageData(imageData, top_x, top_y);
	}

	function BlurStack() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	function drawBlur(canvas, image) {
		var w = canvas.width;
		var h = canvas.height;
		var canvasContext = canvas.getContext('2d');
		canvasContext.drawImage(image, 0, 0, w, h);
		stackBlurCanvasRGBA(canvas, 0, 0, w, h, BLUR_RADIUS);
	};
});
define('components/confirm-dialog',["exports", "aurelia-framework", "aurelia-dialog"], function (exports, _aureliaFramework, _aureliaDialog) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ConfirmDialog = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ConfirmDialog = exports.ConfirmDialog = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
    function ConfirmDialog(controller) {
      _classCallCheck(this, ConfirmDialog);

      this.controller = controller;
    }

    ConfirmDialog.prototype.activate = function activate(model) {
      this.action = model.action;
      this.message = model.message;
    };

    return ConfirmDialog;
  }()) || _class);
});
define('components/ebook-action-list',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.EbookActionList = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

  var EbookActionList = exports.EbookActionList = (_class = function () {
    function EbookActionList() {
      _classCallCheck(this, EbookActionList);

      _initDefineProp(this, "actionName", _descriptor, this);

      _initDefineProp(this, "action", _descriptor2, this);

      _initDefineProp(this, "ebooks", _descriptor3, this);
    }

    _createClass(EbookActionList, [{
      key: "isMore",
      get: function get() {
        return this.ebooks && this.ebooks.lastPage > 1;
      }
    }]);

    return EbookActionList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "actionName", [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return "Action";
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "action", [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "ebooks", [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('components/ebook-panel',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'jquery'], function (exports, _aureliaFramework, _aureliaFetchClient, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.EbookPanel = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var logger = _aureliaFramework.LogManager.getLogger('ebooks-panel');

  var EbookPanel = exports.EbookPanel = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = (_class2 = function () {
    function EbookPanel(http) {
      _classCallCheck(this, EbookPanel);

      _initDefineProp(this, 'sortings', _descriptor, this);

      _initDefineProp(this, 'loader', _descriptor2, this);

      this.http = http;
    }

    EbookPanel.prototype.loaderChanged = function loaderChanged() {
      logger.debug('Loader changed in EbookPanel');
    };

    EbookPanel.prototype.handleImgError = function handleImgError(evt) {
      logger.debug('Missing thumb');
      (0, _jquery2.default)(evt.target).parent().parent().addClass('missing');
    };

    EbookPanel.prototype.handleImgLoad = function handleImgLoad(evt) {
      logger.debug('Load thumb');
      (0, _jquery2.default)(evt.target).parent().parent().removeClass('missing');
    };

    EbookPanel.prototype.getThumbSource = function getThumbSource(ebook) {
      return this.http.baseUrl + '/thumb/' + ebook.id;
    };

    return EbookPanel;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'sortings', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [{ name: 'Title A-Z', key: 'title' }, { name: 'Title Z-A', key: '-title' }, { name: 'Recent First', key: '-created' }, { name: 'Oldest First', key: 'created' }];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'loader', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('components/error-alert',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ErrorAlert = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _desc, _value, _class, _descriptor;

  var ErrorAlert = exports.ErrorAlert = (_dec = (0, _aureliaFramework.bindable)({
    defaultBindingMode: _aureliaFramework.bindingMode.twoWay
  }), (_class = function () {
    function ErrorAlert() {
      _classCallCheck(this, ErrorAlert);

      _initDefineProp(this, 'error', _descriptor, this);
    }

    ErrorAlert.prototype.clearError = function clearError() {
      this.error = undefined;
    };

    return ErrorAlert;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'error', [_dec], {
    enumerable: true,
    initializer: null
  })), _class));
});
define('components/genres-converter',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var GenresValueConverter = exports.GenresValueConverter = function () {
    function GenresValueConverter() {
      _classCallCheck(this, GenresValueConverter);
    }

    GenresValueConverter.prototype.toView = function toView(val) {
      if (!val) return '';
      return val.map(function (g) {
        return g.name;
      }).join(', ');
    };

    return GenresValueConverter;
  }();
});
define('components/genres-edit',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GenresEdit = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2;

  var GenresEdit = exports.GenresEdit = (_class = function () {
    function GenresEdit() {
      _classCallCheck(this, GenresEdit);

      _initDefineProp(this, 'allGenres', _descriptor, this);

      _initDefineProp(this, 'genres', _descriptor2, this);
    }

    GenresEdit.prototype.hasId = function hasId(id) {
      if (!this.genres) return false;
      for (var _iterator = this.genres, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var genre = _ref;

        if (id === genre.id) return true;
      }
      return false;
    };

    GenresEdit.prototype.addGenre = function addGenre() {
      if (!this.genres) this.genres = [];
      if (this._selected) this.genres.push(this._selected);
      this._selected = undefined;
    };

    GenresEdit.prototype.removeGenre = function removeGenre(selected) {
      if (selected !== undefined) this.genres.splice(selected, 1);
    };

    _createClass(GenresEdit, [{
      key: 'visibleGenres',
      get: function get() {
        var _this = this;

        return this.allGenres.filter(function (item) {
          return !_this.hasId(item.id);
        });
      }
    }]);

    return GenresEdit;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'allGenres', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'genres', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('components/list-converter',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ListValueConverter = exports.ListValueConverter = function () {
    function ListValueConverter() {
      _classCallCheck(this, ListValueConverter);
    }

    ListValueConverter.prototype.toView = function toView(list, prop) {
      if (!list || !list.length) return '';
      if (prop) list = list.map(function (i) {
        return i[prop];
      });
      return list.join(', ');
    };

    return ListValueConverter;
  }();
});
define('components/nav-bar',['exports', 'aurelia-framework', 'lib/access', 'jquery'], function (exports, _aureliaFramework, _access, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavBar = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var logger = _aureliaFramework.LogManager.getLogger('nav-bar');

  var NavBar = exports.NavBar = (_dec = (0, _aureliaFramework.inject)(_access.Access), _dec(_class = (_class2 = function () {
    function NavBar(access) {
      _classCallCheck(this, NavBar);

      _initDefineProp(this, 'router', _descriptor, this);

      _initDefineProp(this, 'doSearch', _descriptor2, this);

      this.access = access;
    }

    NavBar.prototype.searchSubmitted = function searchSubmitted(query) {
      logger.debug('navbar.compo' + (0, _jquery2.default)('#skeleton-navigation-navbar-collapse'));
      (0, _jquery2.default)('#skeleton-navigation-navbar-collapse').collapse('hide');
      this.doSearch(query);
    };

    _createClass(NavBar, [{
      key: 'isAuthenticated',
      get: function get() {
        return this.access.authenticated;
      }
    }]);

    return NavBar;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'doSearch', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('components/notification-base',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NotificationBase = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var NotificationBase = exports.NotificationBase = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
    function NotificationBase(router) {
      _classCallCheck(this, NotificationBase);

      this.router = router;
    }

    NotificationBase.prototype.activate = function activate(model) {
      this.notification = model;
    };

    NotificationBase.prototype.navigate = function navigate() {
      throw new Error('Not Implemented');
    };

    _createClass(NotificationBase, [{
      key: 'isReady',
      get: function get() {
        return this.notification.status === 'success' && this.notification.result && !this.notification.done;
      }
    }]);

    return NotificationBase;
  }()) || _class);
});
define('components/notification-convert',['exports', './notification-base'], function (exports, _notificationBase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NotificationMetadata = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var NotificationMetadata = exports.NotificationMetadata = function (_NotificationBase) {
    _inherits(NotificationMetadata, _NotificationBase);

    function NotificationMetadata() {
      _classCallCheck(this, NotificationMetadata);

      return _possibleConstructorReturn(this, _NotificationBase.apply(this, arguments));
    }

    NotificationMetadata.prototype.navigate = function navigate() {
      this.router.navigateToRoute('ebook', { id: this.notification.ebookId });
    };

    return NotificationMetadata;
  }(_notificationBase.NotificationBase);
});
define('components/notification-metadata',['exports', './notification-base'], function (exports, _notificationBase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NotificationMetadata = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var NotificationMetadata = exports.NotificationMetadata = function (_NotificationBase) {
    _inherits(NotificationMetadata, _NotificationBase);

    function NotificationMetadata() {
      _classCallCheck(this, NotificationMetadata);

      return _possibleConstructorReturn(this, _NotificationBase.apply(this, arguments));
    }

    NotificationMetadata.prototype.navigate = function navigate() {
      this.notification.done = true;
      this.router.navigateToRoute('upload-result', { id: this.notification.result });
    };

    return NotificationMetadata;
  }(_notificationBase.NotificationBase);
});
define('components/notifications-drawer',['exports', 'lib/notification', 'aurelia-framework', 'lib/config/index', 'jquery'], function (exports, _notification, _aureliaFramework, _index, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NotificationsDrawer = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('notifications-drawer');

  var NotificationsDrawer = exports.NotificationsDrawer = (_dec = (0, _aureliaFramework.inject)(Element, _notification.Notification, _index.Configure), _dec(_class = function () {
    function NotificationsDrawer(elem, notif, config) {
      _classCallCheck(this, NotificationsDrawer);

      this.notif = notif;
      this.elem = elem;
      this.attention;
      this.attentionTimeout = (config.get('notificationAttentionTimeout') || 20) * 1000;
      this._dispose = notif.addObserver(this.onNotificationsUpdated.bind(this));
    }

    NotificationsDrawer.prototype.attached = function attached() {
      this.root = (0, _jquery2.default)('#drawer-notifications', this.elem);
      this.icon = (0, _jquery2.default)('#drawer-icon', this.elem);
    };

    NotificationsDrawer.prototype.onNotificationsUpdated = function onNotificationsUpdated(action, status) {
      var _this = this;

      logger.debug('Got update ' + action + ' ' + status);
      if (action === 'update' && (status === 'success' || status === 'error')) this.attention = true;
      this._to = window.setTimeout(function () {
        window.clearTimeout(_this._to);
        _this.attention = false;
      }, this.attentionTimeout);
    };

    NotificationsDrawer.prototype.drawerMove = function drawerMove() {
      this.attention = false;
      return true;
    };

    _createClass(NotificationsDrawer, [{
      key: 'fold',
      get: function get() {
        return this.root.hasClass('fold');
      }
    }]);

    return NotificationsDrawer;
  }()) || _class);
});
define('components/search',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Search = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2;

  var Search = exports.Search = (_class = function () {
    function Search() {
      _classCallCheck(this, Search);

      _initDefineProp(this, 'query', _descriptor, this);

      _initDefineProp(this, 'execute', _descriptor2, this);
    }

    Search.prototype.executeSearch = function executeSearch() {

      if (this.query) this.execute({ query: this.query });
    };

    return Search;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'query', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'execute', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('lib/access',['exports', 'aurelia-auth', 'aurelia-auth/authentication', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router'], function (exports, _aureliaAuth, _authentication, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Access = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('access');

  var Access = exports.Access = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService, _authentication.Authentication, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router), _dec(_class = function () {
    function Access(auth, authUtil, event, router) {
      _classCallCheck(this, Access);

      this.auth = auth;
      this.util = authUtil;
      this.event = event;
      this.router = router;
      logger.debug('AuthUtil ' + authUtil);
    }

    Access.prototype.hasRole = function hasRole() {
      var token = this.auth.getTokenPayload();
      if (!token) return false;
      var roles = token.roles;
      if (!roles) return false;

      for (var _len = arguments.length, requiredRoles = Array(_len), _key = 0; _key < _len; _key++) {
        requiredRoles[_key] = arguments[_key];
      }

      return this.checkRoles(requiredRoles, roles);
    };

    Access.prototype.checkRoles = function checkRoles(requiredRoles, roles) {
      return requiredRoles.reduce(function (prev, curr) {
        return prev || roles.includes(curr);
      }, false);
    };

    Access.prototype.canEdit = function canEdit(userId) {
      var token = this.auth.getTokenPayload();
      if (this.checkRoles(['superuser', 'admin'], token.roles)) return true;else if (this.checkRoles(['user'], token.roles) && userId && userId == token.id) return true;
      return false;
    };

    Access.prototype.login = function login(username, password) {
      var _this = this;

      return this.auth.login({ username: username, password: password }).then(function (response) {
        if (response.error) {
          var err = new Error('Invalid login');
          err.error = response.error;
          throw err;
        } else {
          logger.debug("success user logged in: " + JSON.stringify(response));
          _this.event.publish('user-logged-in', { user: _this.currentUser });
        }
      });
    };

    Access.prototype.logout = function logout() {
      this.auth.logout();
      this.event.publish('user-logged-out');
    };

    Access.prototype.signalState = function signalState() {
      if (this.authenticated) {
        this.event.publish('user-logged-in', { user: this.currentUser });
      } else {
        this.event.publish('user-logged-out');
      }
    };

    Access.prototype.authenticate = function authenticate(name) {
      return this.auth.authenticate(name, false, null).then(function (response) {
        logger.debug("auth response " + JSON.stringify(response));
      });
    };

    _createClass(Access, [{
      key: 'token',
      get: function get() {
        return this.util.getToken();
      }
    }, {
      key: 'currentUser',
      get: function get() {
        if (this.auth.isAuthenticated()) {
          return this.auth.getTokenPayload().email;
        }
      }
    }, {
      key: 'authenticated',
      get: function get() {
        return this.auth.isAuthenticated();
      }
    }]);

    return Access;
  }()) || _class);
});
define('lib/api-client',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'bootstrap', 'lib/config/index'], function (exports, _aureliaFetchClient, _aureliaFramework, _bootstrap, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ApiClient = undefined;

  var _bootstrap2 = _interopRequireDefault(_bootstrap);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ApiClient = exports.ApiClient = (_dec = (0, _aureliaFramework.inject)(_index.Configure, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function ApiClient(config, http) {
      _classCallCheck(this, ApiClient);

      this.http = http;
      this.apiPath = config.get('api.path');
      this.baseUrl = http.baseUrl;
      this._cache = new Map();
    }

    ApiClient.prototype.getUrl = function getUrl(r) {
      var query = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      return this.apiPath + '/' + r + (query ? '?' + _bootstrap2.default.param(query) : '');
    };

    ApiClient.prototype.post = function post(resource, data) {
      return this.http.fetch(this.getUrl(resource), { method: 'POST',
        body: (0, _aureliaFetchClient.json)(data)
      }).then(function (resp) {
        return resp.json();
      });
    };

    ApiClient.prototype.delete = function _delete(resource, id) {
      return this.http.fetch(this.getUrl(resource) + '/' + id, { method: 'DELETE' }).then(function (resp) {
        return resp.json();
      });
    };

    ApiClient.prototype.patch = function patch(resource, data, id) {
      return this.http.fetch(this.getUrl(resource + '/' + id), { method: 'PATCH',
        body: (0, _aureliaFetchClient.json)(data) }).then(function (resp) {
        return resp.json();
      });
    };

    ApiClient.prototype.getIndex = function getIndex(resource, start) {
      var url = this.getUrl(resource + '/index/' + encodeURIComponent(start));
      return this.http.fetch(url).then(function (response) {
        return response.json();
      });
    };

    ApiClient.prototype.getManyUnpagedCached = function getManyUnpagedCached(resource) {
      var _this = this;

      var now = new Date();
      if (this._cache.has(resource) && now - this._cache.get(resource).ts < 60 * 3600 * 1000) {
        return Promise.resolve(this._cache.get(resource).data);
      }
      var url = this.getUrl(resource);
      return this.http.fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this._cache.set(resource, { ts: new Date(), data: data });
        return data;
      });
    };

    ApiClient.prototype.getManyUnpaged = function getManyUnpaged(resource) {
      var url = this.getUrl(resource);
      return this.http.fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        return data;
      });
    };

    ApiClient.prototype.getMany = function getMany(resource) {
      var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var pageSize = arguments.length <= 2 || arguments[2] === undefined ? 25 : arguments[2];
      var sort = arguments[3];
      var extra = arguments[4];

      var query = { page: page, page_size: pageSize, sort: sort };
      if (extra) {
        for (var k in extra) {
          if (extra.hasOwnProperty(k)) query[k] = extra[k];
        }
      }
      var url = this.getUrl(resource, query);
      return this.http.fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        var lastPage = Math.ceil(data.total / data.page_size);
        return { data: data.items, lastPage: lastPage };
      });
    };

    ApiClient.prototype.search = function search(query) {
      var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var pageSize = arguments.length <= 2 || arguments[2] === undefined ? 25 : arguments[2];

      return this.getMany('search/' + encodeURIComponent(query), page, pageSize);
    };

    ApiClient.prototype.authorBooks = function authorBooks(id) {
      var filter = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var page = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
      var pageSize = arguments.length <= 3 || arguments[3] === undefined ? 34 : arguments[3];
      var sort = arguments[4];

      return this.getMany('ebooks/author/' + id, page, pageSize, sort, filter ? { filter: encodeURIComponent(filter) } : null);
    };

    ApiClient.prototype.getOne = function getOne(resource, id) {
      var url = this.getUrl(resource + '/' + id);
      return this.http.fetch(url).then(function (response) {
        return response.json();
      });
    };

    ApiClient.prototype.checkUpload = function checkUpload(fileInfo) {
      return this.post('upload/check', fileInfo).then(function (data) {
        if (data.error) throw new Error(data.error);
      });
    };

    ApiClient.prototype.upload = function upload(formData) {
      return this.http.fetch(this.getUrl('upload'), { method: 'post', body: formData }).then(function (resp) {
        return resp.json();
      });
    };

    ApiClient.prototype.addUploadToEbook = function addUploadToEbook(ebookId, uploadId, quality) {
      return this.post('ebooks/' + ebookId + '/add-upload', { upload_id: uploadId, quality: quality });
    };

    ApiClient.prototype.getCover = function getCover(resource, id) {
      var url = this.getUrl(resource + '/' + id + '/cover');
      return this.http.fetch(url).then(function (r) {
        return r.blob();
      });
    };

    return ApiClient;
  }()) || _class);
});
define('lib/application-state',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ApplicationState = exports.ApplicationState = function ApplicationState() {
    _classCallCheck(this, ApplicationState);

    this.token = '1234';
    this.userName = '';
  };
});
define('lib/notification',['exports', 'aurelia-framework', 'lib/config/index', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _index, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Notification = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('notifications');
  var MAX_SIZE = 20;

  var Notification = exports.Notification = (_dec = (0, _aureliaFramework.inject)(_index.Configure, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Notification(config, event) {
      _classCallCheck(this, Notification);

      this.event = event;
      this._observers = new Set();
      this._ns = [];
      this._details = new Map();
    }

    Notification.prototype.addObserver = function addObserver(o) {
      var _this = this;

      this._observers.add(o);
      return function () {
        return _this._observers.delete(0);
      };
    };

    Notification.prototype.updateObservers = function updateObservers(action, status) {
      this._observers.forEach(function (o) {
        return o(action, status);
      });
    };

    Notification.prototype.start = function start(taskId, taskInfo) {

      this._ns.unshift(taskId);
      taskInfo.start = new Date();
      this._details.set(taskId, taskInfo);
      if (this._ns.length > MAX_SIZE) {
        var k = this._ns.pop();
        this._details.delete(k);
      }
      this.updateObservers('start');
    };

    Notification.prototype.update = function update(taskId, obj) {
      if (this._details.has(taskId)) {
        var data = this._details.get(taskId);
        Object.assign(data, obj);
        this.updateObservers('update', obj.status);
        logger.debug('Task updated ' + taskId);
        var task = data.task;
        if (task) {
          if (obj.status === 'success') this.event.publish(task + '-ready', { taskId: taskId, result: obj.result, data: data });else if (obj.status === 'error') this.event.publish(task + '-error', { taskId: taskId, error: obj.error, data: data });
        }
      } else {
        logger.warn('Update for uknown task ' + taskId);
      }
    };

    Notification.prototype.markDone = function markDone(taskId) {
      if (this._details.has(taskId)) {
        this._details.get(taskId).done = true;
      }
    };

    _createClass(Notification, [{
      key: 'items',
      get: function get() {
        var a = [];
        for (var _iterator = this._ns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var taskId = _ref;

          var notif = this._details.get(taskId);
          a.push(notif);
        }
        return a;
      }
    }, {
      key: 'empty',
      get: function get() {
        return !this._ns || this._ns.length === 0;
      }
    }]);

    return Notification;
  }()) || _class);
});
define('lib/ws-client',['exports', 'lib/notification', 'lib/access', 'aurelia-framework', 'lib/config/index', 'aurelia-event-aggregator', 'autobahn'], function (exports, _notification, _access, _aureliaFramework, _index, _aureliaEventAggregator, _autobahn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WSClient = undefined;

  var _autobahn2 = _interopRequireDefault(_autobahn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('ws-client');

  var WSClient = exports.WSClient = (_dec = (0, _aureliaFramework.inject)(_index.Configure, _notification.Notification, _aureliaEventAggregator.EventAggregator, _access.Access), _dec(_class = function () {
    function WSClient(config, notif, event, access) {
      var _this = this;

      _classCallCheck(this, WSClient);

      this.conn = null;
      this.session = null;

      this.notif = notif;
      this.access = access;
      this.config = config;

      window.AUTOBAHN_DEBUG = true;

      event.subscribe('user-logged-in', function (evt) {
        return _this.connect(evt.user);
      });
      event.subscribe('user-logged-out', function () {
        return _this.disconnect();
      });
    }

    WSClient.prototype.connect = function connect(userEmail) {
      var _this2 = this;

      if (this.conn) {
        logger.warn('Connection already exists');
      }
      var connUrl = 'ws://' + this.config.get('wamp.host', window.location.hostname) + ':' + this.config.get('wamp.port') + this.config.get('wamp.path');
      this.conn = new _autobahn2.default.Connection({
        url: connUrl,
        realm: this.config.get('wamp.realm'),
        authmethods: ["ticket"],
        authid: userEmail,
        onchallenge: function onchallenge(session, method, extra) {
          return _this2.onChallenge(session, method, extra);
        }
      });
      logger.debug('WAMP connection requested');
      this.conn.onopen = function (session, details) {
        return _this2.onConnectionOpen(session, details);
      };
      this.conn.onclose = this.onConnectionClose;
      this.conn.open();
    };

    WSClient.prototype.disconnect = function disconnect() {
      if (this.conn) {
        this.conn.close();
        logger.debug('Disconnected WS connection');
        this.conn = null;
        this.session = null;
      }
    };

    WSClient.prototype.receiveNotification = function receiveNotification(args, kwargs, options) {
      logger.debug('Notification ' + JSON.stringify(args) + ', ' + JSON.stringify(kwargs));
      this.notif.update(args[0], kwargs);
    };

    WSClient.prototype.onChallenge = function onChallenge(session, method, extra) {
      logger.debug('Authentication required, method ' + method);
      if (method === 'ticket') {
        return this.access.token;
      } else {
        throw new Error('invalid auth method');
      }
    };

    WSClient.prototype.onConnectionOpen = function onConnectionOpen(session, details) {
      var _this3 = this;

      logger.debug('WAMP connection opened : ' + JSON.stringify(details));
      this.session = session;
      session.subscribe('eu.zderadicka.asexor.task_update', function (args, kwargs, options) {
        return _this3.receiveNotification(args, kwargs, options);
      }).then(function (sub) {
        return logger.debug('WAMP subscribed to notifications');
      }, function (err) {
        return logger.error('WAMP Failed to subscribe to notifications ' + JSON.stringify(err));
      });
    };

    WSClient.prototype.onConnectionClose = function onConnectionClose(reason, details) {
      logger.warn('WAMP connection closed ' + reason);
      this.conn = null;
      this.session = null;
    };

    WSClient.prototype.extractMeta = function extractMeta(fileName) {
      var _this4 = this;

      var originalFileName = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var proposedMeta = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!this.isConnected) {
        alert('WebSocket is not connected, reload application!');
        return;
      }
      return this.session.call('eu.zderadicka.asexor.run_task', ['metadata', fileName, proposedMeta]).then(function (taskId) {
        _this4.notif.start(taskId, {
          text: 'Extract Metadata from ' + (originalFileName || fileName),
          status: "submitted",
          task: "metadata",
          taskId: taskId,
          file: fileName,
          originalFileName: originalFileName
        });
        return taskId;
      });
    };

    WSClient.prototype.convertSource = function convertSource(source, format, ebook) {
      var _this5 = this;

      if (!this.isConnected) {
        alert('WebSocket is not connected, reload application!');
        return;
      }
      return this.session.call('eu.zderadicka.asexor.run_task', ['convert', source.id, format]).then(function (taskId) {
        _this5.notif.start(taskId, {
          text: 'Convert ebook ' + ebook.title + ': from ' + source.format + ' to ' + format,
          status: "submitted",
          task: "convert",
          taskId: taskId,
          sourceId: source.id,
          ebookId: ebook.id
        });
        return taskId;
      });
    };

    _createClass(WSClient, [{
      key: 'isConnected',
      get: function get() {
        return this.session !== null;
      }
    }]);

    return WSClient;
  }()) || _class);
});
define('models/ebook',['exports', 'aurelia-framework', 'aurelia-dependency-injection'], function (exports, _aureliaFramework, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Ebook = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var logger = _aureliaFramework.LogManager.getLogger('ebook');

  var Ebook = exports.Ebook = function () {
    function Ebook(ebook) {
      var _this = this;

      _classCallCheck(this, Ebook);

      this._editableProps = ['title', 'authors[]', 'genres[]', 'language.id', 'series', 'series_index'];

      var bindingEngine = _aureliaDependencyInjection.Container.instance.get(_aureliaFramework.BindingEngine);
      if (ebook) Object.assign(this, ebook);

      this._disposers = [];
      this._changed = new Set();

      var bind = function bind(prop, asArray) {
        var observer = void 0;
        var obj = _this;
        var parts = prop.split('.');
        var propName = parts[0];

        while (parts.length > 1) {
          var _disp = bindingEngine.propertyObserver(obj, parts[0]).subscribe(function (n, o) {
            return _this.changed(propName);
          });
          _this._disposers.push(_disp);
          var newObj = obj[parts[0]];
          if (!newObj) {
            newObj = {};
            obj[parts[0]] = newObj;
          }
          obj = newObj;
          prop = parts[1];
          parts.shift();
        }

        if (asArray) {
          if (!obj[prop]) obj[prop] = [];
          observer = bindingEngine.collectionObserver(obj[prop]);
        } else {
          observer = bindingEngine.propertyObserver(obj, prop);
        }
        var disp = observer.subscribe(function (n, o) {
          return _this.changed(propName, n, o);
        });
        _this._disposers.push(disp);
      };

      for (var _iterator = this.editableProps2, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _ref2 = _ref;
        var prop = _ref2[0];
        var asArray = _ref2[1];

        bind(prop, asArray);
      }
    }

    Ebook.prototype.isNew = function isNew() {
      return !this.id;
    };

    Ebook.prototype.changed = function changed(prop, n, o) {
      logger.debug('Property changed ' + prop);
      this._changed.add(prop);
    };

    Ebook.prototype.dispose = function dispose() {
      this._disposers.forEach(function (d) {
        return d.dispose();
      });
    };

    Ebook.prototype.validate = function validate(addError) {
      if (!this.title) addError('title', 'Title is mandatory!');
      if (this.title && this.title.length > 256) addError('title', 'Title too long');

      if (!this.language || !this.language.id) addError('language', 'Language is mandatory');

      if (this.series && this.series.title && !this.series_index) addError('series', 'If series title is present then series index is mandatory');
      if (!(this.series && this.series.title) && this.series_index) addError('series', 'If series index is present then series title is mandatory');
      if (this.series && this.series.title && this.series.title.length > 256) addError('series', 'Series title too long');
      if (this.series_index && !Number.isInteger(this.series_index) && !this.series_index.match(/^\d+$/)) addError('series', 'Series index must be numeric');

      if (this.authors && this.authors.length > 20) addError('authors', 'Too many authors');

      if (this.genres && this.genres.length > 10) addError('genres', 'Too many genres');
    };

    Ebook.prototype.prepareData = function prepareData() {
      var data = {};

      var shrink = function shrink(obj) {
        if (!obj) return null;
        if (obj.hasOwnProperty('id') && obj.id) {
          return { id: obj.id };
        } else {
          var newObj = {};
          for (var _iterator2 = Object.keys(obj), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref3 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref3 = _i2.value;
            }

            var prop = _ref3;

            if (prop !== 'id' && obj[prop]) newObj[prop] = obj[prop];
          }
          if (Object.keys(newObj).length === 0) return null;
          return newObj;
        }
      };

      var shrinkList = function shrinkList(l) {
        if (!l) return [];
        return l.map(shrink).filter(function (x) {
          return x;
        });
      };

      var compareObjects = function compareObjects(o1, o2) {
        return JSON.stringify(o1) === JSON.stringify(o2);
      };

      for (var _iterator3 = this.editableProps, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref4 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref4 = _i3.value;
        }

        var prop = _ref4;

        if (this.isNew() || this._changed.has(prop)) {
          var val = this[prop];
          if (Array.isArray(val)) val = shrinkList(val);else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') val = shrink(val);
          data[prop] = val;
        }
      }


      if (!this.isNew() && Object.keys(data).length) {
        data.id = this.id;
        data.version_id = this.version_id;
      }

      logger.debug('New data : ' + JSON.stringify(data));
      return data;
    };

    _createClass(Ebook, [{
      key: 'editableProps',
      get: function get() {
        return this._editableProps.map(function (p) {
          p = p.split('.')[0];
          return p.endsWith('[]') ? p.slice(0, -2) : p;
        });
      }
    }, {
      key: 'editableProps2',
      get: function get() {
        return this._editableProps.map(function (p) {
          return p.endsWith('[]') ? [p.slice(0, -2), true] : [p, false];
        });
      }
    }]);

    return Ebook;
  }();
});
define('pages/author',['exports', 'aurelia-framework', 'lib/api-client'], function (exports, _aureliaFramework, _apiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Author = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

  var logger = _aureliaFramework.LogManager.getLogger('search');

  var Author = exports.Author = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient), _dec2 = (0, _aureliaFramework.computedFrom)('_loader'), _dec(_class = (_class2 = function () {
    function Author(client) {
      _classCallCheck(this, Author);

      _initDefineProp(this, 'filter', _descriptor, this);

      this.client = client;
    }

    Author.prototype.activate = function activate(params) {
      var _this = this;

      logger.debug('Author activated with ' + JSON.stringify(params));
      this.id = decodeURIComponent(params.id);
      this.client.getOne('authors', params.id).then(function (data) {
        _this.author = data;logger.debug('Loaded author' + JSON.stringify(data));
      });

      this.updateLoader();
    };

    Author.prototype.filterChanged = function filterChanged() {
      logger.debug('Filter changed to ' + this.filter);
      this.updateLoader();
    };

    Author.prototype.updateLoader = function updateLoader() {
      this._loader = this.client.authorBooks.bind(this.client, this.id, this.filter);
    };

    _createClass(Author, [{
      key: 'loader',
      get: function get() {
        return this._loader;
      }
    }]);

    return Author;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'filter', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, 'loader', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'loader'), _class2.prototype)), _class2)) || _class);
});
define('pages/ebook-edit',['exports', 'aurelia-framework', 'aurelia-router', 'jquery', 'lib/api-client', 'lib/access', 'models/ebook', 'aurelia-dialog', 'components/confirm-dialog'], function (exports, _aureliaFramework, _aureliaRouter, _jquery, _apiClient, _access, _ebook, _aureliaDialog, _confirmDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.EditEbook = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var logger = _aureliaFramework.LogManager.getLogger('ebook-edit');

  var EditEbook = exports.EditEbook = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient, _aureliaRouter.Router, _access.Access, _aureliaDialog.DialogService), _dec(_class = (_class2 = function () {
    function EditEbook(client, router, access, dialog) {
      _classCallCheck(this, EditEbook);

      _initDefineProp(this, '_series', _descriptor, this);

      this.client = client;
      this.router = router;
      this.access = access;
      this.dialog = dialog;
    }

    EditEbook.prototype.canActivate = function canActivate(params) {
      var _this = this;

      if (params.id !== undefined) {
        return this.client.getOne('ebooks', params.id).then(function (b) {
          _this.ebook = new _ebook.Ebook(b);
          _this._series = b.series ? b.series.title : undefined;
          logger.debug('Ebook data ' + JSON.stringify(b));
          return _this.access.canEdit(b.created_by);
        }).catch(function (err) {
          logger.error('Failed to load ' + err);
          return false;
        });
      } else {
        this.ebook = new _ebook.Ebook();
        this._series = undefined;
        return true;
      }
    };

    EditEbook.prototype.activate = function activate(params) {
      var _this2 = this;

      logger.debug('Activated with ' + JSON.stringify(params));
      var promises = [];

      promises.push(this.client.getManyUnpagedCached('languages').then(function (data) {
        _this2._languages = data;
        logger.debug('Got languages ' + JSON.stringify(_this2._languages));
      }), this.client.getManyUnpagedCached('genres').then(function (data) {
        return _this2._genres = data;
      }));

      if (params.upload) {
        promises.push(this.client.getOne('uploads-meta', params.upload).then(function (upload) {
          _this2.uploadId = upload.id;
          _this2.meta = upload.meta;
        }).catch(function (err) {
          return logger.error('Upload fetch error: ' + err);
        }));
      }

      return Promise.all(promises).then(function () {
        logger.debug('Try to use metada ' + JSON.stringify(_this2.meta));
        if (_this2.meta) _this2.prefill();
      });
    };

    EditEbook.prototype.deactivate = function deactivate() {
      if (this.ebook) this.ebook.dispose();
    };

    EditEbook.prototype.prefill = function prefill() {
      if (this.meta.title) this.ebook.title = this.meta.title;
      if (this.meta.authors && this.meta.authors.length) {
        this.ebook.authors = this.meta.authors;
      }
      if (this.meta.series && this.meta.series.title) {
        this.ebook.series = this.meta.series;
        this._series = this.meta.series.title;
        this.ebook.series_index = this.meta.series_index;
      }

      if (this.meta.language && this.meta.language.id) {
        this.ebook.language = { id: this.meta.language.id };
      }

      if (this.meta.genres && this.meta.genres.length) {
        this.ebook.genres = this.meta.genres.filter(function (i) {
          return i.id;
        });
      }
    };

    EditEbook.prototype._seriesChanged = function _seriesChanged() {
      logger.debug('Series is ' + this._series + ' selected ' + JSON.stringify(this._seriesSelected));
      if (this._seriesSelected) this.ebook.series = this._seriesSelected;else this.ebook.series = { title: this._series };
    };

    EditEbook.prototype.save = function save() {
      var _this3 = this;

      this.error = undefined;

      if (this.validate()) {
        var data = this.ebook.prepareData();
        if (!data || !Object.keys(data).length) {
          this.error = { error: 'No changes to save' };
          return;
        }
        var result = void 0;
        if (this.ebook.id) {
          result = this.client.patch('ebooks', data, this.ebook.id);
        } else {
          result = this.client.post('ebooks', data);
        }

        result.then(function (res) {
          if (res.error) {
            _this3.error = { error: res.error, errorDetail: res.error_details };
          } else if (res.id) {
            var action = _this3.uploadId ? _this3.client.addUploadToEbook(res.id, _this3.uploadId, _this3.meta.quality || null) : Promise.resolve({});
            action.then(function (res2) {
              if (res2.error) _this3.error = {
                error: res2.error,
                errorDetail: res2.error_details };else _this3.router.navigateToRoute('ebook', { id: res.id });
            }).catch(function (err) {
              return _this3.error = { error: "Server error attaching source", errorDetail: err };
            });
          } else {
            _this3.error = { error: 'Invalid respose', errorDetail: 'Ebook ID is missing' };
          }
        }).catch(function (err) {
          return _this3.error = { error: 'Request failed', errorDetail: err };
        });
      } else {
        logger.debug('Validation fails');
      }
    };

    EditEbook.prototype.validate = function validate() {
      (0, _jquery2.default)('.has-error').removeClass('has-error');
      (0, _jquery2.default)('.help-block').remove();
      var errors = [];

      var addError = function addError(what, err) {
        errors.push(err);
        var grp = (0, _jquery2.default)('#' + what + '-input-group');
        grp.addClass('has-error');
        (0, _jquery2.default)('<span>').addClass('help-block').text(err).appendTo(grp);
      };
      this.ebook.validate(addError);
      return errors.length === 0;
    };

    EditEbook.prototype.cancel = function cancel() {
      if (this.ebook.id) {
        this.router.navigateToRoute('ebook', { id: this.ebook.id });
      } else {
        this.router.navigate('welcome');
      }
    };

    EditEbook.prototype.canDelete = function canDelete() {
      return this.ebook.id && this.access.canEdit(this.ebook.created_by);
    };

    EditEbook.prototype.delete = function _delete() {
      var _this4 = this;

      this.error = undefined;
      this.dialog.open({ viewModel: _confirmDialog.ConfirmDialog, model: { action: 'Delete', message: 'Do you want to delete ebook ' + this.ebook.title } }).then(function (response) {
        if (!response.wasCancelled && _this4.ebook.id) {
          _this4.client.delete('ebooks', _this4.ebook.id).then(function (res) {
            if (res.error) {
              _this4.error = { error: res.error, errorDetail: res.error_details };
            } else {
              _this4.router.navigateToRoute('welcome');
            }
          }).catch(function (err) {
            return _this4.error = { error: 'Delete error', errorDetail: err };
          });
        }
      });
    };

    _createClass(EditEbook, [{
      key: 'seriesLoader',
      get: function get() {
        var _this5 = this;

        return function (start) {
          return _this5.client.getIndex('series', start);
        };
      }
    }]);

    return EditEbook;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, '_series', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('pages/ebook',['exports', 'aurelia-framework', 'lib/api-client', 'lib/access', 'aurelia-dialog', 'components/confirm-dialog', 'lib/ws-client', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _apiClient, _access, _aureliaDialog, _confirmDialog, _wsClient, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Ebook = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('ebooks');

  var Ebook = exports.Ebook = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient, _wsClient.WSClient, _access.Access, _aureliaDialog.DialogService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Ebook(client, ws, access, dialog, event) {
      _classCallCheck(this, Ebook);

      this.client = client;
      this.ws = ws;
      this.access = access;
      this.dialog = dialog;
      this.event = event;
      this.token = access.token;
      this.canDownload = access.hasRole('user');
      this.canConvert = access.hasRole('user');
      this.cover = new Image();
      this.cover.onload = function () {
        URL.revokeObjectURL(this.src);
      };
      this.subscribeConvertEvents();
    }

    Ebook.prototype.subscribeConvertEvents = function subscribeConvertEvents() {
      var _this = this;

      var deactivateSource = function deactivateSource(sourceId) {
        if (_this.ebook.sources) _this.ebook.sources.filter(function (s) {
          return s.id === sourceId;
        }).forEach(function (s) {
          if (s.active) --s.active;
        });
      };
      this.event.subscribe('convert-ready', function (msg) {
        if (_this.ebook && _this.ebook.id === msg.data.ebookId) {
          deactivateSource(msg.data.sourceId);
          _this.updateConverted();
        }
      });
      this.event.subscribe('convert-error', function (msg) {
        if (_this.ebook && _this.ebook.id === msg.data.ebookId) {
          deactivateSource(msg.data.sourceId);
          _this.ebook.sources.filter(function (s) {
            return s.id === msg.data.sourceId;
          }).forEach(function (s) {
            return s.error = msg.error;
          });
        }
        logger.error('Conversion failed due to ' + msg.error);
      });
    };

    Ebook.prototype.canActivate = function canActivate(params) {
      var _this2 = this;

      return this.client.getOne('ebooks', params.id).then(function (b) {
        _this2.ebook = b;
        return _this2.client.getCover('ebooks', b.id).then(function (blob) {
          _this2.cover.src = URL.createObjectURL(blob);
          return true;
        }).catch(function (err) {
          logger.warn('Cannot load cover for ebook ' + b.id + ': ' + err);
          return true;
        });
        return true;
      }).catch(function (err) {
        logger.error('Failed to load ' + err);
        return false;
      });
    };

    Ebook.prototype.activate = function activate(params) {
      this.updateConverted();
    };

    Ebook.prototype.updateConverted = function updateConverted() {
      var _this3 = this;

      this.client.getManyUnpaged('ebooks/' + this.ebook.id + '/converted').then(function (data) {
        return _this3.convertedSources = data.items;
      }).catch(function (err) {
        return logger.error('Cannot get converted sources', err);
      });
    };

    Ebook.prototype.attached = function attached() {
      if (this.cover.src) document.getElementById('cover-holder').appendChild(this.cover);
    };

    Ebook.prototype.canDeleteSource = function canDeleteSource(source) {
      return this.access.canEdit(source.created_by);
    };

    Ebook.prototype.deleteSource = function deleteSource(source) {
      var _this4 = this;

      this.dialog.open({
        viewModel: _confirmDialog.ConfirmDialog,
        model: {
          action: 'Delete',
          message: 'Do you want to delete ' + source.format + ' file from ebook ' + this.ebook.title + '?'
        }
      }).then(function (resp) {
        if (!resp.wasCancelled) {
          _this4.client.delete('sources', source.id).then(function (res) {
            if (res.error) {
              logger.error('Source delete failed: ' + res.error + ' ' + res.error_details);
              alert('Cannot delete: ' + res.error);
            } else {
              var idx = _this4.ebook.sources.findIndex(function (x) {
                return x === source;
              });
              if (idx >= 0) _this4.ebook.sources.splice(idx, 1);
              _this4.updateConverted();
            }
          }).catch(function (err) {
            logger.error('Server error: ' + err);
          });
        }
      });
    };

    _createClass(Ebook, [{
      key: 'isEditable',
      get: function get() {
        return this.ebook && this.access.canEdit(this.ebook.created_by);
      }
    }, {
      key: 'searchString',
      get: function get() {
        var s = '';
        if (this.ebook.authors) s += this.ebook.authors.slice(0, 2).map(function (a) {
          return a.first_name ? a.first_name + ' ' + a.last_name : a.last_name;
        }).join(' ');
        s += ' ' + this.ebook.title;
        return encodeURIComponent(s);
      }
    }, {
      key: 'convertSource',
      get: function get() {
        var _this5 = this;

        return function (format, source) {
          source.error = undefined;
          if (format != source.format) {
            _this5.ws.convertSource(source, format, _this5.ebook).then(function (taskId) {
              if (!source.active) source.active = 1;else source.active += 1;
              logger.debug('Converting ' + JSON.stringify(source) + ' to ' + format + ' in task ' + taskId);
            }).catch(function (err) {
              alert('Conversion submission error');
              logger.error('Conversion submission error: ' + JSON.stringify(err));
            });
          };
        };
      }
    }]);

    return Ebook;
  }()) || _class);
});
define('pages/ebooks',['exports', 'aurelia-framework', 'lib/api-client'], function (exports, _aureliaFramework, _apiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Ebooks = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('ebooks');

  var Ebooks = exports.Ebooks = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient), _dec(_class = function () {
    function Ebooks(client) {
      _classCallCheck(this, Ebooks);

      this.client = client;
    }

    Ebooks.prototype.activate = function activate(params) {
      logger.debug('History State ' + JSON.stringify(history.state));
    };

    _createClass(Ebooks, [{
      key: 'loader',
      get: function get() {
        return this.client.getMany.bind(this.client, 'ebooks');
      }
    }]);

    return Ebooks;
  }()) || _class);
});
define('pages/login',['exports', 'lib/access', 'aurelia-framework'], function (exports, _access, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

    var logger = _aureliaFramework.LogManager.getLogger('login');

    var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_access.Access), _dec(_class = (_class2 = function () {
        function Login(access) {
            _classCallCheck(this, Login);

            this.title = 'Login';

            _initDefineProp(this, 'email', _descriptor, this);

            _initDefineProp(this, 'password', _descriptor2, this);

            this.error = false;

            this.access = access;
        }

        Login.prototype.login = function login() {
            var _this = this;

            return this.access.login(this.email, this.password).then(function () {
                return _this.error = undefined;
            }).catch(function (err) {
                _this.error = { error: 'Login Failed', errorDetail: err.error ? err.error : err };
                logger.error("Login failure: " + err);
            });
        };

        Login.prototype.canDeactivate = function canDeactivate() {
            return !this.error;
        };

        return Login;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'email', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return '';
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'password', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return '';
        }
    })), _class2)) || _class);
});
define('pages/search',['exports', 'aurelia-framework', 'lib/api-client'], function (exports, _aureliaFramework, _apiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Search = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _dec2, _class, _desc, _value, _class2;

  var logger = _aureliaFramework.LogManager.getLogger('search');

  var Search = exports.Search = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient), _dec2 = (0, _aureliaFramework.computedFrom)('_loader'), _dec(_class = (_class2 = function () {
    function Search(client) {
      _classCallCheck(this, Search);

      this.client = client;
    }

    Search.prototype.activate = function activate(params) {
      logger.debug('Search actited with ' + JSON.stringify(params));
      this.query = decodeURIComponent(params.query);
      this._loader = this.client.search.bind(this.client, this.query);
    };

    Search.prototype.bind = function bind(ctx, newCtx) {
      logger.debug('Search bind');
    };

    _createClass(Search, [{
      key: 'loader',
      get: function get() {
        return this._loader;
      }
    }]);

    return Search;
  }(), (_applyDecoratedDescriptor(_class2.prototype, 'loader', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'loader'), _class2.prototype)), _class2)) || _class);
});
define('pages/upload-result',['exports', 'aurelia-framework', 'lib/api-client', 'aurelia-router'], function (exports, _aureliaFramework, _apiClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UploadResult = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var logger = _aureliaFramework.LogManager.getLogger('upload-result');

  var UploadResult = exports.UploadResult = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient, _aureliaRouter.Router), _dec(_class = function () {
    function UploadResult(client, router) {
      _classCallCheck(this, UploadResult);

      this.cover = new Image();

      this.client = client;
      this.router = router;

      this.cover.onload = function () {
        URL.revokeObjectURL(this.src);
      };
    }

    UploadResult.prototype.canActivate = function canActivate(model) {
      var _this = this;

      logger.debug('Activated with ' + JSON.stringify(model));
      this.id = model.id;
      return this.client.getOne('uploads-meta', model.id).then(function (meta) {
        _this.meta = meta.meta;
        _this.metaId = meta.id;
        _this.file = meta.load_source;
        logger.debug('Got meta ' + JSON.stringify(meta));
        _this.client.getCover('uploads-meta', model.id).then(function (blob) {
          return _this.cover.src = URL.createObjectURL(blob);
        });

        return meta.meta;
      }).then(function (meta) {
        var authors = meta.authors ? meta.authors.map(function (a) {
          return a.first_name ? a.first_name + ' ' + a.last_name : a.last_name;
        }).join(' ') : null;
        var search = meta.title ? meta.title : '';
        search = meta.series ? search + ' ' + meta.series.title : search;
        search = authors ? authors + ' ' + search : search;
        logger.debug('Searching for ebooks: ' + search);
        return _this.client.search(search, 1, 5).catch(function (err) {
          logger.error('Search failed: ' + err);
          return {};
        });
      }).then(function (result) {
        logger.debug('Found ' + result.data);
        if (result.data && result.data.length) _this.ebooksCandidates = result;
        return true;
      }).catch(function (err) {
        logger.error('Upload meta error ' + err);
        return false;
      });
    };

    UploadResult.prototype.attached = function attached() {
      if (this.cover.src) document.getElementById('cover-holder').appendChild(this.cover);
    };

    UploadResult.prototype.createNew = function createNew() {
      this.router.navigateToRoute('ebook-create', { upload: this.id });
    };

    _createClass(UploadResult, [{
      key: 'addToEbook',
      get: function get() {
        var _this2 = this;

        return function (ebookId) {
          _this2.client.addUploadToEbook(ebookId, _this2.id, _this2.meta.quality || null).then(function (res) {
            if (res.error) _this2.error = {
              error: res.error,
              errorDetail: res.error_details
            };else {
              _this2.router.navigateToRoute('ebook', {
                id: ebookId
              });
            }
          }).catch(function (err) {
            return _this2.error = {
              error: 'Server error',
              errorDetail: err
            };
          });
        };
      }
    }, {
      key: 'search',
      get: function get() {
        var _this3 = this;

        return function (_ref) {
          var query = _ref.query;

          _this3.ebooksSearched = null;
          _this3.client.search(query, 1, 5).then(function (res) {
            _this3.ebooksSearched = res;
          }).catch(function (err) {
            return _this3.error = { error: 'Search error', errorDetail: err };
          });
        };
      }
    }]);

    return UploadResult;
  }()) || _class);
});
define('pages/upload',['exports', 'aurelia-framework', 'lib/api-client', 'lib/config/index', 'lib/ws-client', 'aurelia-event-aggregator', 'lib/notification', 'aurelia-router'], function (exports, _aureliaFramework, _apiClient, _index, _wsClient, _aureliaEventAggregator, _notification, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Upload = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var logger = _aureliaFramework.LogManager.getLogger('upload');

  function hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
      var value = view.getUint32(i);

      var stringValue = value.toString(16);

      var padding = '00000000';
      var paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }

    return hexCodes.join("");
  }

  var Upload = exports.Upload = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient, _wsClient.WSClient, _index.Configure, _aureliaEventAggregator.EventAggregator, _notification.Notification, _aureliaRouter.Router), _dec(_class = (_class2 = function () {
    function Upload(client, wsClient, config, event, notif, router) {
      _classCallCheck(this, Upload);

      this.fileOK = false;
      this.uploading = false;
      this.checking = false;
      this.uploadError = null;
      this.uploadId = null;

      _initDefineProp(this, 'rating', _descriptor, this);

      this.client = client;
      this.wsClient = wsClient;
      this.config = config;
      this.event = event;
      this.notif = notif;
      this.router = router;
    }

    Upload.prototype.upload = function upload() {
      var _this = this;

      this.fileOK = false;
      this.checking = false;
      this.uploading = true;
      logger.debug('Uploading file');
      var formData = new FormData(document.getElementById('file-upload-form'));
      this.client.upload(formData).then(function (data) {
        if (data.error) {
          _this.uploadError = 'Upload error: ' + data.error;
          logger.error('Upload error: ' + data.error);
          _this.uploading = false;
        } else {
          logger.debug('File uploaded ' + JSON.stringify(data));
          var origName = document.getElementById('file-input').value;
          _this.wsClient.extractMeta(data.file, origName, { quality: _this.rating }).then(function (taskId) {
            logger.debug('Task ID ' + taskId + ' for file ' + data.file);
            _this.event.subscribe('metadata-ready', function (result) {
              if (taskId === result.taskId) {
                _this.uploading = false;
                _this.notif.markDone(taskId);
                _this.router.navigateToRoute('upload-result', { id: result.result });
              }
            });
            _this.event.subscribe('metadata-error', function (result) {
              if (taskId === result.taskId) {
                _this.uploading = false;
                _this.uploadError = 'Error in metadata: ' + result.error;
              }
            });
          }).catch(function (err) {
            logger.error('Error when extracting metadata: ' + err);
            _this.uploading = false;
            _this.uploadError = 'Error in metadata: ' + err;
          });
        }
      });
    };

    Upload.prototype.checkFile = function checkFile() {
      var _this2 = this;

      this.checking = true;
      this.uploading = false;
      this.fileOK = false;
      this.uploadError = null;
      this.uploadId = null;

      var files = document.getElementById('file-input');
      if (files.files.length < 1) {
        this.checking = false;
        return;
      }
      var file = files.files[0];
      if (file.size > this.config.get('maxUploadSize')) {
        this.uploadError = 'Are you mad? This file is just too big for ebook!';
        this.checking = false;
        return;
      }
      var fileInfo = {
        mime_type: file.type,
        size: file.size,
        hash: null
      };
      var reader = new FileReader();
      reader.onload = function () {
        return crypto.subtle.digest("SHA-1", reader.result).then(function (val) {
          fileInfo.hash = hex(val);
          logger.debug('File info ' + JSON.stringify(fileInfo));
          _this2.client.checkUpload(fileInfo).then(function () {
            _this2.checking = false;
            _this2.fileOK = true;
          }).catch(function (err) {
            _this2.checking = false;
            logger.error('File check error', err);
            _this2.uploadError = 'Check error: ' + err;
          });
        });
      };
      reader.readAsArrayBuffer(file);
      logger.debug('Checking file ' + file.name);
    };

    return Upload;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'rating', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
});
define('pages/welcome',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Welcome = exports.Welcome = function Welcome() {
    _classCallCheck(this, Welcome);
  };
});
define('test/test-page',['exports', 'aurelia-framework', 'lib/api-client'], function (exports, _aureliaFramework, _apiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TestPage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var TestPage = exports.TestPage = (_dec = (0, _aureliaFramework.inject)(_apiClient.ApiClient), _dec(_class = function () {
    function TestPage(client) {
      _classCallCheck(this, TestPage);

      this.client = client;
    }

    TestPage.prototype.getFullName = function getFullName(item) {
      return item.first_name ? item.last_name + ', ' + item.first_name : item.last_name;
    };

    _createClass(TestPage, [{
      key: 'seriesSelectedRepr',
      get: function get() {
        return JSON.stringify(this.seriesSelected);
      }
    }, {
      key: 'loaderSeries',
      get: function get() {
        var _this = this;

        return function (start) {
          return _this.client.getIndex('series', start);
        };
      }
    }, {
      key: 'loaderEbooks',
      get: function get() {
        var _this2 = this;

        return function (start) {
          return _this2.client.getIndex('ebooks', start);
        };
      }
    }, {
      key: 'loaderAuthors',
      get: function get() {
        var _this3 = this;

        return function (start) {
          return _this3.client.getIndex('authors', start);
        };
      }
    }]);

    return TestPage;
  }()) || _class);
});
define('components/autocomplete/autocomplete',['exports', 'aurelia-framework', 'jquery', 'diacritic'], function (exports, _aureliaFramework, _jquery, _diacritic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Autocomplete = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  var _diacritic2 = _interopRequireDefault(_diacritic);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

  var logger = _aureliaFramework.LogManager.getLogger('autocomplete');

  var CACHE_DURATION = 60000;

  function startsWith(string, start) {
    string = _diacritic2.default.clean(string).toLowerCase();
    start = _diacritic2.default.clean(start).toLowerCase();
    return string.startsWith(start);
  }

  var Autocomplete = exports.Autocomplete = (_dec = (0, _aureliaFramework.inject)(Element), _dec2 = (0, _aureliaFramework.bindable)({
    defaultBindingMode: _aureliaFramework.bindingMode.twoWay
  }), _dec3 = (0, _aureliaFramework.bindable)({
    defaultBindingMode: _aureliaFramework.bindingMode.twoWay
  }), _dec(_class = (_class2 = function () {
    function Autocomplete(elem) {
      _classCallCheck(this, Autocomplete);

      _initDefineProp(this, 'value', _descriptor, this);

      _initDefineProp(this, 'selectedValue', _descriptor2, this);

      _initDefineProp(this, 'loader', _descriptor3, this);

      _initDefineProp(this, 'minLength', _descriptor4, this);

      _initDefineProp(this, 'valueKey', _descriptor5, this);

      _initDefineProp(this, 'suggestionTemplate', _descriptor6, this);

      _initDefineProp(this, 'additionalClass', _descriptor7, this);

      _initDefineProp(this, 'placeholder', _descriptor8, this);

      this._suggestions = [];
      this._selected = null;
      this._suggestionsShown = false;
      this._ignoreChange = false;
      this._attached = false;

      this.elem = elem;
    }

    Autocomplete.prototype.valueChanged = function valueChanged() {
      var _this = this;

      if (!this._attached) return;

      if (this._ignoreChange) {
        this._ignoreChange = false;
        return;
      }
      this.selectedValue = undefined;
      if (!this.value || this.value.length < this.minLength) {
        this._suggestions = [];
        this.hideSuggestions();
        return;
      }

      this.getSuggestions(this.value).then(function (suggestions) {
        _this._suggestions = suggestions;
        if (_this._suggestions.length) {
          _this.showSuggestions();
        }
      });
    };

    Autocomplete.prototype.attached = function attached() {
      this.suggestionsList = (0, _jquery2.default)('div.autocomplete-suggestion', this.elem);
      this._attached = true;
      this.hideSuggestions();
    };

    Autocomplete.prototype.getSuggestionValue = function getSuggestionValue(item) {
      if (!this.valueKey) {
        return item;
      } else if (typeof this.valueKey === 'string') {
        return item[this.valueKey];
      } else if (typeof this.valueKey === 'function') {
        return this.valueKey(item);
      }
    };

    Autocomplete.prototype.getSuggestions = function getSuggestions(forValue) {
      var _this2 = this;

      logger.debug('Get suggestions for ' + forValue);
      if (Array.isArray(this.loader)) {
        return Promise.resolve(this.loader.filter(function (item) {
          return startsWith(_this2.getSuggestionValue(item), forValue);
        }));
      } else if (typeof this.loader === 'function') {
        if (this._cache && startsWith(forValue, this._cache.search) && new Date() - this._cache.ts <= CACHE_DURATION) {
          return Promise.resolve(this._cache.items.filter(function (item) {
            return startsWith(_this2.getSuggestionValue(item), forValue);
          }));
        }
        return this.loader(forValue).then(function (res) {

          if (res.items.length === res.total) {
            _this2._cache = {
              search: forValue,
              items: res.items,
              ts: new Date()
            };
          }

          if (_this2.value !== forValue) return [];

          return res.items;
        });
      }
      return Promise.reject(new Error('Invalid loader'));
    };

    Autocomplete.prototype.keyPressed = function keyPressed(evt) {
      logger.debug('Key pressed ' + evt.keyCode);
      if (this._suggestionsShown) {
        var key = evt.keyCode;
        switch (key) {
          case 13:
            if (this._selected !== null) this.select(this._selected);
            break;
          case 40:
            this._selected++;
            if (this._selected >= this._suggestions.length) this._selected = this._suggestions.length - 1;
            this.makeVisible(this._selected);
            break;
          case 38:
            this._selected--;
            if (this._selected < 0) this._selected = 0;
            this.makeVisible(this._selected);
            break;
          case 27:
            this.hideSuggestions();
            break;
        }
      }
      return true;
    };

    Autocomplete.prototype.makeVisible = function makeVisible(idx) {
      var item = (0, _jquery2.default)('a[data-index="' + idx + '"]', this.elem);
      if (item && item.position()) {
        this.suggestionsList.scrollTop(this.suggestionsList.scrollTop() + item.position().top);
      }
    };

    Autocomplete.prototype.select = function select(idx) {
      logger.debug('Selected index ' + idx);
      var newValue = this.getSuggestionValue(this._suggestions[idx]);
      logger.debug('Selected ' + newValue);
      if (this.value !== newValue) this._ignoreChange = true;
      this.value = newValue;
      this.selectedValue = this._suggestions[idx];
      this.hideSuggestions();
    };

    Autocomplete.prototype.hideSuggestions = function hideSuggestions() {
      this._suggestionsShown = false;
      this._selected = null;
      this.suggestionsList.hide();
    };

    Autocomplete.prototype.showSuggestions = function showSuggestions() {
      this._suggestionsShown = true;
      this._selected = this._suggestions.length ? 0 : null;
      this.suggestionsList.show();
      this.makeVisible(this._selected);
    };

    return Autocomplete;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'selectedValue', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'loader', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'minLength', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'valueKey', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'suggestionTemplate', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'additionalClass', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'placeholder', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class);
});
define('components/context-menu/context-menu',['exports', 'aurelia-framework', 'jquery'], function (exports, _aureliaFramework, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContextMenu = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var logger = _aureliaFramework.LogManager.getLogger('context-menu');

  (0, _aureliaFramework.inject)(Element);
  var ContextMenu = exports.ContextMenu = (_class = function () {
    function ContextMenu(elem) {
      _classCallCheck(this, ContextMenu);

      _initDefineProp(this, 'items', _descriptor, this);

      _initDefineProp(this, 'title', _descriptor2, this);

      _initDefineProp(this, 'width', _descriptor3, this);

      _initDefineProp(this, 'action', _descriptor4, this);

      this.elem = elem;
    }

    ContextMenu.prototype.attached = function attached() {
      var _this = this;

      this.root = (0, _jquery2.default)('div.context-menu', this.elem);
      (0, _jquery2.default)(window).click(function () {
        return _this.hide();
      });
    };

    ContextMenu.prototype.show = function show(evt, context) {
      this.context = context;
      evt.stopPropagation();
      this.root.show();
      var pageX = evt.pageX;
      var pageY = evt.pageY;

      this.root.offset({ top: pageY, left: pageX });

      var _root$offset = this.root.offset();

      var top = _root$offset.top;
      var left = _root$offset.left;

      var win = (0, _jquery2.default)(window);
      var bottom = top + this.root.height();
      var right = left + this.root.width();

      if (right > win.width()) pageX = pageX - this.root.width();
      if (bottom > win.height()) pageY = pageY - this.root.height();
      this.root.offset({ top: pageY, left: pageX });
    };

    ContextMenu.prototype.hide = function hide() {
      this.root.hide();
    };

    ContextMenu.prototype.select = function select(item) {
      if (this.action) this.action(item.value, this.context);else alert('Selected ' + item.value);
      this.hide();
    };

    return ContextMenu;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'items', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'title', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 'Context Menu';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'width', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 128;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'action', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('components/pagination/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources('./page-controller', './pager', './sorter');
  }
});
define('components/pagination/page-controller',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PageController = undefined;

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var logger = _aureliaFramework.LogManager.getLogger('page-controller');

  var PageController = exports.PageController = (_dec = (0, _aureliaFramework.noView)(), _dec2 = (0, _aureliaFramework.processContent)(false), _dec3 = (0, _aureliaFramework.customElement)('page-controller'), _dec4 = (0, _aureliaFramework.computedFrom)('data', 'loader'), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function () {
    function PageController() {
      _classCallCheck(this, PageController);

      _initDefineProp(this, 'page', _descriptor, this);

      _initDefineProp(this, 'sort', _descriptor2, this);

      _initDefineProp(this, 'pageSize', _descriptor3, this);

      this.loading = false;
      this.data = [];

      _initDefineProp(this, 'loader', _descriptor4, this);

      _initDefineProp(this, 'noSort', _descriptor5, this);

      logger.debug('Constructing PageContoller');

      if (history.state) {
        var state = history.state;
        logger.debug('restoring page-controller back to ' + JSON.stringify(state));
        if (state.page && state.page != this.page) {
          this.page = state.page;
        }
        if (state.sort) {
          this.sort = state.sort;
          logger.debug('sort2 is ' + this.sort);
        }
      }
    }

    PageController.prototype.created = function created(owningView, myView) {
      logger.debug('Creating PageController');
    };

    PageController.prototype.bind = function bind(ctx) {
      logger.debug('Binding PageController');

      if (history.state && history.state.page || this.noSort) this.loadPage(this.page);
    };

    PageController.prototype.attached = function attached() {
      logger.debug('PageController attached');
    };

    PageController.prototype.loadPage = function loadPage(page) {
      var _this = this;

      var unbinded = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      logger.debug('Loading page ' + page + ', ' + this.sort + ' by ' + this.loader.name);
      this.loading = true;
      return this.loader(page, this.pageSize, this.sort).then(function (_ref) {
        var data = _ref.data;
        var lastPage = _ref.lastPage;
        _this.data = data;
        _this.lastPage = lastPage;
      }, function (err) {
        return logger.error('Page load error: ' + err);
      }).then(function () {
        return _this.loading = false;
      });
    };

    PageController.prototype.pageChanged = function pageChanged(newPage) {
      var _this2 = this;

      logger.debug('page changed ' + newPage);
      this.loadPage(this.page).then(function () {
        history.replaceState(_extends({}, history.state || {}, { page: _this2.page, sort: _this2.sort }), '');
      });
    };

    PageController.prototype.sortChanged = function sortChanged(newValue, old) {
      logger.debug('sort changed ' + this.sort);
      this.reset();
    };

    PageController.prototype.loaderChanged = function loaderChanged() {
      logger.debug('Loader changed in PageController');
      this.reset();
    };

    PageController.prototype.reset = function reset() {
      var oldPage = this.page;
      this.page = 1;
      if (oldPage == 1) this.pageChanged(1, 1);
    };

    _createClass(PageController, [{
      key: 'empty',
      get: function get() {
        return !this.data || this.data.length == 0;
      }
    }]);

    return PageController;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'page', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 10;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'loader', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return function () {
        return Promise.reject(new Error('No loader specified!'));
      };
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'noSort', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, 'empty', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'empty'), _class2.prototype)), _class2)) || _class) || _class) || _class);
});
define('components/pagination/pager',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Pager = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var logger = _aureliaFramework.LogManager.getLogger('pager');

  var Pager = exports.Pager = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.DOM.Element), _dec(_class = (_class2 = function () {
    function Pager(elem) {
      _classCallCheck(this, Pager);

      _initDefineProp(this, 'page', _descriptor, this);

      _initDefineProp(this, 'lastPage', _descriptor2, this);

      _initDefineProp(this, 'loading', _descriptor3, this);

      this.elem = elem;
    }

    Pager.prototype.activated = function activated() {
      logger.debug('Pager activated');
    };

    Pager.prototype.nextPage = function nextPage() {
      if (this.page < this.lastPage && !this.loading) this.page++;
    };

    Pager.prototype.prevPage = function prevPage() {
      if (this.page > 1 && !this.loading) this.page--;
    };

    _createClass(Pager, [{
      key: 'nextPageNo',
      get: function get() {
        return Math.min(this.lastPage, this.page + 1);
      }
    }, {
      key: 'prevPageNo',
      get: function get() {
        return Math.max(this.page - 1, 1);
      }
    }, {
      key: 'isFirstPage',
      get: function get() {
        return this.page === 1;
      }
    }, {
      key: 'isLastPage',
      get: function get() {
        return this.page === this.lastPage || !this.lastPage;
      }
    }]);

    return Pager;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'page', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'lastPage', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class);
});
define('components/pagination/sorter',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sorter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2;

  var logger = _aureliaFramework.LogManager.getLogger('sorter');

  var sorter = exports.sorter = (_class = function sorter() {
    _classCallCheck(this, sorter);

    _initDefineProp(this, 'sort', _descriptor, this);

    _initDefineProp(this, 'sortings', _descriptor2, this);

    if (history.state) {
      var state = history.state;
      logger.debug('restoring sorter back to ' + JSON.stringify(state));
      if (state.sort) {
        this.sort = state.sort;
        logger.debug('sort is ' + this.sort);
      }
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'sort', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'sortings', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('components/rating/rating',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Rating = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

  var logger = _aureliaFramework.LogManager.getLogger('rating');

  var Rating = exports.Rating = (_dec = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), (_class = function () {
    function Rating() {
      _classCallCheck(this, Rating);

      _initDefineProp(this, 'numStars', _descriptor, this);

      _initDefineProp(this, 'rating', _descriptor2, this);

      _initDefineProp(this, 'size', _descriptor3, this);

      _initDefineProp(this, 'max', _descriptor4, this);

      _initDefineProp(this, 'onRatingChange', _descriptor5, this);

      _initDefineProp(this, 'readOnly', _descriptor6, this);
    }

    Rating.prototype.bind = function bind() {
      this.stars = [];
      for (var i = 0; i < this.numStars; i++) {
        this.stars.push({ rated: false, proposed: false });
      }logger.debug('Bound rating ' + this.rating);
      this.updateRating(this.rating);
    };

    Rating.prototype.updateRating = function updateRating(v) {
      var idx = Math.round(v / (this.max / this.numStars)) - 1;
      for (var i = 0; i <= idx; i++) {
        this.stars[i].rated = true;
      }for (var _i = idx + 1; _i < this.numStars; _i++) {
        this.stars[_i].rated = false;
      }
    };

    Rating.prototype.ratingChanged = function ratingChanged(v) {
      logger.debug('Rating changed ' + this.rating);
      this.updateRating(v);
      if (this.onRatingChange) {
        var res = this.onRatingChange(this.rating);
        if (res instanceof Promise) {
          res.catch(function (err) {
            return logger.error('Rating update failed: ' + err);
          });
        }
      }
    };

    Rating.prototype.propose = function propose(idx) {
      if (this.readOnly) return;
      for (var i = 0; i <= idx; i++) {
        this.stars[i].proposed = true;
      }for (var _i2 = idx + 1; _i2 < this.numStars; _i2++) {
        this.stars[_i2].proposed = false;
      }
    };

    Rating.prototype.clearProposed = function clearProposed() {
      if (this.readOnly) return;
      for (var i = 0; i < this.numStars; i++) {
        this.stars[i].proposed = false;
      }
    };

    Rating.prototype.rate = function rate(idx) {
      if (this.readOnly) return;
      this.rating = this.max / this.numStars * (idx + 1);
      this.clearProposed();
    };

    Rating.prototype.resetRating = function resetRating() {
      this.rating = null;
    };

    return Rating;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'numStars', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 5;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'rating', [_dec], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'size', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 1.0;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'max', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 100;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'onRatingChange', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'readOnly', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class));
});
define('lib/config/config',['exports', 'aurelia-framework', 'config/config'], function (exports, _aureliaFramework, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Configure = undefined;

  var _config2 = _interopRequireDefault(_config);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var logger = _aureliaFramework.LogManager.getLogger('config');

  var Configure = exports.Configure = function () {
    function Configure() {
      _classCallCheck(this, Configure);

      this._config = _config2.default;
    }

    Configure.prototype.get = function get(key) {
      var defval = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

      var parent = this._config;
      for (var _iterator = key.split('.'), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var k = _ref;

        if (parent.hasOwnProperty(k) && parent[k]) {
          parent = parent[k];
        } else {
          return defval;
        };
      }
      return parent;
    };

    return Configure;
  }();
});
define('lib/config/index',['exports', './config', 'aurelia-framework'], function (exports, _config, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Configure = undefined;
  exports.configure = configure;


  var logger = _aureliaFramework.LogManager.getLogger('config');

  function configure(aurelia, cb) {
    logger.debug('Calling configure method');
    var instance = aurelia.container.get(_config.Configure);
    if (cb && typeof cb == 'function') {
      cb(instance);
    }
  }

  exports.Configure = _config.Configure;
});
define('aurelia-auth/auth-service',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _authentication, _baseConfig, _oAuth, _oAuth2, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
      _classCallCheck(this, AuthService);

      this.http = http;
      this.auth = auth;
      this.oAuth1 = oAuth1;
      this.oAuth2 = oAuth2;
      this.config = config.current;
      this.tokenInterceptor = auth.tokenInterceptor;
      this.eventAggregator = eventAggregator;
    }

    AuthService.prototype.getMe = function getMe() {
      var profileUrl = this.auth.getProfileUrl();
      return this.http.fetch(profileUrl).then(_authUtilities.status);
    };

    AuthService.prototype.isAuthenticated = function isAuthenticated() {
      return this.auth.isAuthenticated();
    };

    AuthService.prototype.getTokenPayload = function getTokenPayload() {
      return this.auth.getPayload();
    };

    AuthService.prototype.signup = function signup(displayName, email, password) {
      var _this = this;

      var signupUrl = this.auth.getSignupUrl();
      var content = void 0;
      if (_typeof(arguments[0]) === 'object') {
        content = arguments[0];
      } else {
        content = {
          'displayName': displayName,
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(signupUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.loginOnSignup) {
          _this.auth.setToken(response);
        } else if (_this.config.signupRedirect) {
          window.location.href = _this.config.signupRedirect;
        }
        _this.eventAggregator.publish('auth:signup', response);
        return response;
      });
    };

    AuthService.prototype.login = function login(email, password) {
      var _this2 = this;

      var loginUrl = this.auth.getLoginUrl();
      var content = void 0;
      if (typeof arguments[1] !== 'string') {
        content = arguments[0];
      } else {
        content = {
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(loginUrl, {
        method: 'post',
        headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
        body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        _this2.auth.setToken(response);
        _this2.eventAggregator.publish('auth:login', response);
        return response;
      });
    };

    AuthService.prototype.logout = function logout(redirectUri) {
      this.eventAggregator.publish('auth:logout');
      return this.auth.logout(redirectUri);
    };

    AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
      var _this3 = this;

      var provider = this.oAuth2;
      if (this.config.providers[name].type === '1.0') {
        provider = this.oAuth1;
      }

      return provider.open(this.config.providers[name], userData || {}).then(function (response) {
        _this3.auth.setToken(response, redirect);
        _this3.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
    };

    AuthService.prototype.unlink = function unlink(provider) {
      var _this4 = this;

      var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

      if (this.config.unlinkMethod === 'get') {
        return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
          _this4.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      } else if (this.config.unlinkMethod === 'post') {
        return this.http.fetch(unlinkUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(provider)
        }).then(_authUtilities.status).then(function (response) {
          _this4.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      }
    };

    return AuthService;
  }()) || _class);
});
define('aurelia-auth/authentication',['exports', 'aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig), _dec(_class = function () {
    function Authentication(storage, config) {
      _classCallCheck(this, Authentication);

      this.storage = storage;
      this.config = config.current;
      this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
      this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }

    Authentication.prototype.getLoginRoute = function getLoginRoute() {
      return this.config.loginRoute;
    };

    Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
      return this.initialUrl || this.config.loginRedirect;
    };

    Authentication.prototype.getLoginUrl = function getLoginUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    };

    Authentication.prototype.getSignupUrl = function getSignupUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    };

    Authentication.prototype.getProfileUrl = function getProfileUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    };

    Authentication.prototype.getToken = function getToken() {
      return this.storage.get(this.tokenName);
    };

    Authentication.prototype.getPayload = function getPayload() {
      var token = this.storage.get(this.tokenName);
      return this.decomposeToken(token);
    };

    Authentication.prototype.decomposeToken = function decomposeToken(token) {
      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        try {
          return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch (error) {
          return null;
        }
      }
    };

    Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
      this.initialUrl = url;
    };

    Authentication.prototype.setToken = function setToken(response, redirect) {
      var accessToken = response && response[this.config.responseTokenProp];
      var tokenToStore = void 0;

      if (accessToken) {
        if ((0, _authUtilities.isObject)(accessToken) && (0, _authUtilities.isObject)(accessToken.data)) {
          response = accessToken;
        } else if ((0, _authUtilities.isString)(accessToken)) {
          tokenToStore = accessToken;
        }
      }

      if (!tokenToStore && response) {
        tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
      }

      if (tokenToStore) {
        this.storage.set(this.tokenName, tokenToStore);
      }

      var idToken = response && response[this.config.responseIdTokenProp];

      if (idToken) {
        this.storage.set(this.idTokenName, idToken);
      }

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.getLoginRedirect();
      } else if (redirect && (0, _authUtilities.isString)(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    };

    Authentication.prototype.removeToken = function removeToken() {
      this.storage.remove(this.tokenName);
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (!token) {
        return false;
      }

      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }

      return true;
    };

    Authentication.prototype.logout = function logout(redirect) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if ((0, _authUtilities.isString)(redirect)) {
          window.location.href = redirect;
        }

        resolve();
      });
    };

    _createClass(Authentication, [{
      key: 'tokenInterceptor',
      get: function get() {
        var config = this.config;
        var storage = this.storage;
        var auth = this;
        return {
          request: function request(_request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              _request.headers.set(config.authHeader, token);
            }
            return _request;
          }
        };
      }
    }]);

    return Authentication;
  }()) || _class);
});
define('aurelia-auth/base-config',['exports', './auth-utilities'], function (exports, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BaseConfig = exports.BaseConfig = function () {
    BaseConfig.prototype.configure = function configure(incomingConfig) {
      (0, _authUtilities.merge)(this._current, incomingConfig);
    };

    _createClass(BaseConfig, [{
      key: 'current',
      get: function get() {
        return this._current;
      }
    }]);

    function BaseConfig() {
      _classCallCheck(this, BaseConfig);

      this._current = {
        httpInterceptor: true,
        loginOnSignup: true,
        baseUrl: '/',
        loginRedirect: '#/',
        logoutRedirect: '#/',
        signupRedirect: '#/login',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        profileUrl: '/auth/me',
        loginRoute: '/login',
        signupRoute: '/signup',
        tokenRoot: false,
        tokenName: 'token',
        idTokenName: 'id_token',
        tokenPrefix: 'aurelia',
        responseTokenProp: 'access_token',
        responseIdTokenProp: 'id_token',
        unlinkUrl: '/auth/unlink/',
        unlinkMethod: 'get',
        authHeader: 'Authorization',
        authToken: 'Bearer',
        withCredentials: true,
        platform: 'browser',
        storage: 'localStorage',
        providers: {
          identSrv: {
            name: 'identSrv',
            url: '/auth/identSrv',

            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'openid'],
            responseType: 'code',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display', 'state'],
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            display: 'popup',
            type: '2.0',
            clientId: 'jsClient',
            nonce: function nonce() {
              var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
              return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            type: '2.0',
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            popupOptions: {
              width: 452,
              height: 633
            }
          },
          facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
            scope: ['email'],
            scopeDelimiter: ',',
            nonce: function nonce() {
              return Math.random();
            },
            requiredUrlParams: ['nonce', 'display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 580,
              height: 400
            }
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: {
              width: 527,
              height: 582
            }
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            type: '2.0',
            popupOptions: {
              width: 1020,
              height: 618
            }
          },
          yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: [],
            scopeDelimiter: ',',
            type: '2.0',
            popupOptions: {
              width: 559,
              height: 519
            }
          },
          twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            type: '1.0',
            popupOptions: {
              width: 495,
              height: 645
            }
          },
          live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            requiredUrlParams: ['display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 500,
              height: 560
            }
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 550,
              height: 369
            }
          }
        }
      };
    }

    return BaseConfig;
  }();
});
define('aurelia-auth/auth-utilities',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.status = status;
  exports.isDefined = isDefined;
  exports.camelCase = camelCase;
  exports.parseQueryString = parseQueryString;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.joinUrl = joinUrl;
  exports.isBlankObject = isBlankObject;
  exports.isArrayLike = isArrayLike;
  exports.isWindow = isWindow;
  exports.extend = extend;
  exports.merge = merge;
  exports.forEach = forEach;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var slice = [].slice;

  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  function status(response) {
    if (response.status >= 200 && response.status < 400) {
      return response.json().catch(function (error) {
        return null;
      });
    }

    throw response;
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  function parseQueryString(keyValue) {
    var key = void 0;
    var value = void 0;
    var obj = {};

    forEach((keyValue || '').split('&'), function (kv) {
      if (kv) {
        value = kv.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });

    return obj;
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }

    var joined = [baseUrl, url].join('/');
    var normalize = function normalize(str) {
      return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
    };

    return normalize(joined);
  }

  function isBlankObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
  }

  function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
      return false;
    }
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }

  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }

  function forEach(obj, iterator, context) {
    var key = void 0;
    var length = void 0;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (Array.isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
});
define('aurelia-auth/storage',['exports', 'aurelia-dependency-injection', './base-config'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
      this.storage = this._getStorage(this.config.storage);
    }

    Storage.prototype.get = function get(key) {
      return this.storage.getItem(key);
    };

    Storage.prototype.set = function set(key, value) {
      return this.storage.setItem(key, value);
    };

    Storage.prototype.remove = function remove(key) {
      return this.storage.removeItem(key);
    };

    Storage.prototype._getStorage = function _getStorage(type) {
      if (type === 'localStorage') {
        if ('localStorage' in window && window.localStorage !== null) return localStorage;
        throw new Error('Local Storage is disabled or unavailable.');
      } else if (type === 'sessionStorage') {
        if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
        throw new Error('Session Storage is disabled or unavailable.');
      }

      throw new Error('Invalid storage type specified: ' + type);
    };

    return Storage;
  }()) || _class);
});
define('aurelia-auth/oAuth1',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth1 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
    function OAuth1(storage, popup, http, config) {
      _classCallCheck(this, OAuth1);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.defaults = {
        url: null,
        name: null,
        popupOptions: null,
        redirectUri: null,
        authorizationEndpoint: null
      };
    }

    OAuth1.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);
      var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

      if (this.config.platform !== 'mobile') {
        this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
      }
      return this.http.fetch(serverUrl, {
        method: 'post'
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.platform === 'mobile') {
          _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
        } else {
          _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
        }

        var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
        return popupListener.then(function (result) {
          return _this.exchangeForToken(result, userData, current);
        });
      });
    };

    OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, oauthData);
      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
      var str = [];
      (0, _authUtilities.forEach)(obj, function (value, key) {
        return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };

    return OAuth1;
  }()) || _class);
});
define('aurelia-auth/popup',['exports', './auth-utilities', './base-config', 'aurelia-dependency-injection'], function (exports, _authUtilities, _baseConfig, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Popup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Popup(config) {
      _classCallCheck(this, Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    Popup.prototype.open = function open(url, windowName, options, redirectUri) {
      this.url = url;
      var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
      this.popupWindow = window.open(url, windowName, optionsString);
      if (this.popupWindow && this.popupWindow.focus) {
        this.popupWindow.focus();
      }

      return this;
    };

    Popup.prototype.eventListener = function eventListener(redirectUri) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        self.popupWindow.addEventListener('loadstart', function (event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');
          parser.href = event.url;

          if (parser.search || parser.hash) {
            var queryParams = parser.search.substring(1).replace(/\/$/, '');
            var hashParams = parser.hash.substring(1).replace(/\/$/, '');
            var hash = (0, _authUtilities.parseQueryString)(hashParams);
            var qs = (0, _authUtilities.parseQueryString)(queryParams);

            (0, _authUtilities.extend)(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
          }
        });

        popupWindow.addEventListener('exit', function () {
          reject({
            data: 'Provider Popup was closed'
          });
        });

        popupWindow.addEventListener('loaderror', function () {
          deferred.reject({
            data: 'Authorization Failed'
          });
        });
      });
      return promise;
    };

    Popup.prototype.pollPopup = function pollPopup() {
      var _this = this;

      var self = this;
      var promise = new Promise(function (resolve, reject) {
        _this.polling = setInterval(function () {
          try {
            var documentOrigin = document.location.host;
            var popupWindowOrigin = self.popupWindow.location.host;

            if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
              var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
              var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
              var hash = (0, _authUtilities.parseQueryString)(hashParams);
              var qs = (0, _authUtilities.parseQueryString)(queryParams);

              (0, _authUtilities.extend)(qs, hash);

              if (qs.error) {
                reject({
                  error: qs.error
                });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
              clearInterval(self.polling);
            }
          } catch (error) {}

          if (!self.popupWindow) {
            clearInterval(self.polling);
            reject({
              data: 'Provider Popup Blocked'
            });
          } else if (self.popupWindow.closed) {
            clearInterval(self.polling);
            reject({
              data: 'Problem poll popup'
            });
          }
        }, 35);
      });
      return promise;
    };

    Popup.prototype.prepareOptions = function prepareOptions(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return (0, _authUtilities.extend)({
        width: width,
        height: height,
        left: window.screenX + (window.outerWidth - width) / 2,
        top: window.screenY + (window.outerHeight - height) / 2.5
      }, options);
    };

    Popup.prototype.stringifyOptions = function stringifyOptions(options) {
      var parts = [];
      (0, _authUtilities.forEach)(options, function (value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return Popup;
  }()) || _class);
});
define('aurelia-auth/oAuth2',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _authentication, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth2 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth2 = exports.OAuth2 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig, _authentication.Authentication), _dec(_class = function () {
    function OAuth2(storage, popup, http, config, auth) {
      _classCallCheck(this, OAuth2);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.auth = auth;
      this.defaults = {
        url: null,
        name: null,
        state: null,
        scope: null,
        scopeDelimiter: null,
        redirectUri: null,
        popupOptions: null,
        authorizationEndpoint: null,
        responseParams: null,
        requiredUrlParams: null,
        optionalUrlParams: null,
        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        responseType: 'code'
      };
    }

    OAuth2.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);

      var stateName = current.name + '_state';

      if ((0, _authUtilities.isFunction)(current.state)) {
        this.storage.set(stateName, current.state());
      } else if ((0, _authUtilities.isString)(current.state)) {
        this.storage.set(stateName, current.state);
      }

      var nonceName = current.name + '_nonce';

      if ((0, _authUtilities.isFunction)(current.nonce)) {
        this.storage.set(nonceName, current.nonce());
      } else if ((0, _authUtilities.isString)(current.nonce)) {
        this.storage.set(nonceName, current.nonce);
      }

      var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

      var openPopup = void 0;
      if (this.config.platform === 'mobile') {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
      } else {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
      }

      return openPopup.then(function (oauthData) {
        if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().includes('TOKEN')) {
          if (!_this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return _this.exchangeForToken(oauthData, userData, current);
      });
    };

    OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
      var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
      if (!idToken) return true;
      var idTokenObject = this.auth.decomposeToken(idToken);
      if (!idTokenObject) return true;
      var nonceFromToken = idTokenObject.nonce;
      if (!nonceFromToken) return true;
      var nonceInStorage = this.storage.get(providerName + '_nonce');
      if (nonceFromToken !== nonceInStorage) {
        return false;
      }
      return true;
    };

    OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, {
        code: oauthData.code,
        clientId: current.clientId,
        redirectUri: current.redirectUri
      });

      if (oauthData.state) {
        data.state = oauthData.state;
      }

      (0, _authUtilities.forEach)(current.responseParams, function (param) {
        return data[param] = oauthData[param];
      });

      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth2.prototype.buildQueryString = function buildQueryString(current) {
      var _this2 = this;

      var keyValuePairs = [];
      var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

      (0, _authUtilities.forEach)(urlParams, function (params) {
        (0, _authUtilities.forEach)(current[params], function (paramName) {
          var camelizedName = (0, _authUtilities.camelCase)(paramName);
          var paramValue = (0, _authUtilities.isFunction)(current[paramName]) ? current[paramName]() : current[camelizedName];

          if (paramName === 'state') {
            var stateName = current.name + '_state';
            paramValue = encodeURIComponent(_this2.storage.get(stateName));
          }

          if (paramName === 'nonce') {
            var nonceName = current.name + '_nonce';
            paramValue = encodeURIComponent(_this2.storage.get(nonceName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(current.scopeDelimiter);

            if (current.scopePrefix) {
              paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
            }
          }

          keyValuePairs.push([paramName, paramValue]);
        });
      });

      return keyValuePairs.map(function (pair) {
        return pair.join('=');
      }).join('&');
    };

    return OAuth2;
  }()) || _class);
});
define('aurelia-auth/authorize-step',['exports', 'aurelia-dependency-injection', 'aurelia-router', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorizeStep = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
    function AuthorizeStep(auth) {
      _classCallCheck(this, AuthorizeStep);

      this.auth = auth;
    }

    AuthorizeStep.prototype.run = function run(routingContext, next) {
      var isLoggedIn = this.auth.isAuthenticated();
      var loginRoute = this.auth.getLoginRoute();

      if (routingContext.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        if (!isLoggedIn) {
          this.auth.setInitialUrl(window.location.href);
          return next.cancel(new _aureliaRouter.Redirect(loginRoute));
        }
      } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
        return i.fragment === loginRoute;
      })) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    };

    return AuthorizeStep;
  }()) || _class);
});
define('aurelia-auth/auth-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
    function FetchConfig(httpClient, authService) {
      _classCallCheck(this, FetchConfig);

      this.httpClient = httpClient;
      this.auth = authService;
    }

    FetchConfig.prototype.configure = function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        }).withInterceptor(_this.auth.tokenInterceptor);
      });
    };

    return FetchConfig;
  }()) || _class);
});
define('aurelia-auth/auth-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      _classCallCheck(this, AuthFilterValueConverter);
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (r) {
        return r.config.auth === undefined || r.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) return this._closePromise;

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        return Promise.resolve();
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog,ai-dialog-container>div>div{min-width:300px;margin:auto;display:block}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.transient(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });

      if (this.cssText) {
        _aureliaPal.DOM.injectStyles(this.cssText);
      }
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', './dialog-options', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _dialogOptions, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this.dialogControllers = [];

      this.escapeKeyEvent = function (e) {
        if (e.keyCode === 27) {
          var top = _this.dialogControllers[_this.dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };

      this.defaultSettings = _dialogOptions.dialogOptions;
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
      this.modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this.dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this.escapeKeyEvent);
      }

      this.dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this.dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this.dialogControllers.splice(i, 1);
      }

      if (!this.dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this.escapeKeyEvent);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3.dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      var _this = this;

      var dialogController = void 0;

      var promise = new Promise(function (resolve, reject) {
        var childContainer = _this.container.createChild();
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), settings, resolve, reject);
        childContainer.registerInstance(_dialogController.DialogController, dialogController);
        return _openDialog(_this, childContainer, dialogController);
      });

      return promise.then(function (result) {
        var i = _this.controllers.indexOf(dialogController);
        if (i !== -1) {
          _this.controllers.splice(i, 1);
          _this.hasActiveDialog = !!_this.controllers.length;
        }

        return result;
      });
    };

    DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
      var _this2 = this;

      var childContainer = this.container.createChild();
      var dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), settings, null, null);
      childContainer.registerInstance(_dialogController.DialogController, dialogController);

      dialogController.result = new Promise(function (resolve, reject) {
        dialogController._resolve = resolve;
        dialogController._reject = reject;
      }).then(function (result) {
        var i = _this2.controllers.indexOf(dialogController);
        if (i !== -1) {
          _this2.controllers.splice(i, 1);
          _this2.hasActiveDialog = !!_this2.controllers.length;
        }
        return result;
      });

      return _openDialog(this, childContainer, dialogController).then(function () {
        return dialogController;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new _aureliaTemplating.ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          service.controllers.push(dialogController);
          service.hasActiveDialog = !!service.controllers.length;

          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"bootstrap-drawer/css/bootstrap-drawer.css\"></require>\n  <require from=\"font-awesome/css/font-awesome.css\"></require>\n  <require from=\"components/nav-bar\"></require>\n  <require from=\"components/notifications-drawer\"></require>\n\n  <nav-bar router.bind=\"router\" do-search.bind=\"doSearch\"></nav-bar>\n<div class=\"page-host-overfloable has-drawer\">\n\n    <router-view></router-view>\n    <notifications-drawer if.bind=\"access.authenticated\"></notifications-drawer>\n</div>\n</template>\n"; });
define('text!components/autocomplete/autocomplete.css', ['module'], function(module) { module.exports = ".autocomplete-suggestion {\n  position: absolute;\n  top: 32px;\n  left: 2px;\n  height: 300px;\n  z-index: 999;\n  overflow-y:auto;\n}\n\n.autocomplete-container {\n  position: relative;\n}\n"; });
define('text!pub-app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!components/context-menu/context-menu.css', ['module'], function(module) { module.exports = ".context-menu {\n  box-shadow: 3px 3px 5px 0px rgba(0,0,0,0.50);\n  z-index: 4000;\n  position:absolute;\n  border-radius: 5px;\n}\n\n.context-menu .list-group {\n  margin-bottom: 0px;\n}\n\n.context-menu .header {\n  font-weight: bold;\n}\n\n.context-menu a.item {\n  color: #337ab7;\n  cursor: pointer;\n}\n"; });
define('text!components/author.html', ['module'], function(module) { module.exports = "<template>\n  <a class=\"author-link\" href=\"${link}\" if.bind=\"linked\">${fullName}</a>\n  <span if.bind=\"!linked\">${fullName}</span>\n  ${!last?', ':''}\n</template>\n"; });
define('text!components/rating/rating.css', ['module'], function(module) { module.exports = ".rating-proposed {\n  color: #3c763d  !important;\n}\n\n.rating-rated {\n  color: #8a6d3b;\n}\n\n.rating-clear {\n color: #a94442;\n}\n\n.rating {\n  display: inline;\n}\n"; });
define('text!components/authors-edit.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/autocomplete/autocomplete\"></require>\n  <div class=\"authors-edit\">\n    <div class=\"authors-edit-list edit-list\">\n      <div class=\"authors-edit-list-item\" repeat.for=\"author of authorsVisible\">${author}\n        <i click.delegate=\"removeAuthor($index)\" class=\"fa fa-minus-circle fa-1x\" aria-hidden=\"true\"></i></div>\n    </div>\n\n    <autocomplete loader.bind=\"loaderAuthors\" value-key.bind=\"getFullName\" suggestion-template=\"./autocomplete-authors.html\"\n    value.bind=\"_author\" selected-value.bind=\"_authorSelected\" placeholder=\"Add Author as Last, First\" additional-class=\"secondary-input\"></autocomplete>\n    <i click.delegate=\"addAuthor()\" class=\"fa fa-plus-circle fa-2x\" aria-hidden=\"true\"></i>\n\n  </div>\n</template>\n"; });
define('text!components/authors.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/author\"></require>\n  <div class=\"ebook-authors\">\n    <author containerless repeat.for=\"author of authors\" if.bind=\"!many\" author.bind=\"author\" last.bind=\"$last\" linked.bind=\"linked\"></author>\n    <span class=\"many-authors\" if.bind=\"many\">Many authors</span>\n  </div>\n</template>\n"; });
define('text!components/confirm-dialog.html', ['module'], function(module) { module.exports = "<template>\n    <ai-dialog>\n        <ai-dialog-header><h3>Confirm ${action}</h3></ai-dialog-header>\n        <ai-dialog-body>\n            <p>${message}</p>\n        </ai-dialog-body>\n        <ai-dialog-footer>\n            <button class=\"btn btn-default\" click.trigger=\"controller.cancel()\">No</button>\n            <button class=\"btn btn-primary\" click.trigger=\"controller.ok()\">Yes</button>\n        </ai-dialog-footer>\n    </ai-dialog>\n</template>\n"; });
define('text!components/ebook-action-list.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors\"></require>\n  <ul class=\"list-group\">\n    <li class=\"list-group-item\" repeat.for=\"ebook of ebooks.data\">\n      <authors authors.one-time=\"ebook.authors\" compact.bind=\"true\" linked.bind=\"false\"></authors>\n      <span class=\"ebook-title\">${ebook.title} (${ebook.language.name})</span>\n      <span class=\"ebook-series\" if.bind=\"ebook.series\">(${ebook.series.title} #${ebook.series_index})</span>\n      <button class=\"btn btn-xs btn-default\" click.delegate=\"action(ebook.id)\">${actionName}</button>\n    </li>\n    <li class=\"list-group-item\" if.bind=\"isMore\"><p>There is more ...</p></li>\n  </ul>\n</template>\n"; });
define('text!components/ebook-panel.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors\"></require>\n  <section>\n    <div class='container-fluid items-header'>\n      <h3 class=\"page-title\">Ebooks (Page ${paginator.page} of ${paginator.lastPage})\n    <div class='sorter' if.bind=\"sortings.length\">\n      <label class=\"sorter-label\"><i class=\"fa fa-sort\"></i></label>\n      <sorter  sortings.one-time=\"sortings\" view-model.ref=\"sorter\"></sorter>\n    </div>\n    </h2>\n  </div>\n  <page-controller view-model.ref='paginator' loader.bind=\"loader\" sort.bind=\"sorter.sort\" page-size=\"12\" no-sort.bind=\"!sortings.length\"></page-controller>\n\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-sm-6 col-md-4 col-lg-3\" repeat.for=\"ebook of paginator.data\">\n          <div class='ebook-detail'>\n              <div class=\"ebook-cover\"><a href=\"#/ebook/${ebook.id}\"><img src.bind=\"getThumbSource(ebook)\"\n                error.trigger=\"handleImgError($event)\" load.trigger=\"handleImgLoad($event)\"></a></div>\n            <div class=\"ebook-info\">\n            <authors authors.one-time=\"ebook.authors\" compact.bind=\"true\"></authors>\n            <div class=\"ebook-title\"><a href=\"#/ebook/${ebook.id}\">${ebook.title}</a></div>\n            <div class=\"ebook-series\" if.bind=\"ebook.series\">${ebook.series.title} #${ebook.series_index}</div>\n          </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n  <pager page.two-way=\"paginator.page\" last-page.bind=\"paginator.lastPage\" loading.bind=\"paginator.loading\"></pager>\n    </section>\n\n</template>\n"; });
define('text!components/error-alert.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"alert alert-danger alert-dismissible\" role=\"alert\" if.bind=\"error\">\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" click.delegate=\"clearError()\"><span aria-hidden=\"true\">&times;</span></button>\n    <strong>${error.error}</strong> ${error.errorDetail}\n  </div>\n</template>\n"; });
define('text!components/genres-edit.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"genres-edit-list edit-list\">\n    <div class=\"genres-edit-list-item\" repeat.for=\"genre of genres\">${genre.name}\n      <i click.delegate=\"removeGenre($index)\" class=\"fa fa-minus-circle fa-1x\" aria-hidden=\"true\"></i></div>\n  </div>\n  \n  <select value.bind=\"_selected\" class=\"secondary-input\" change.delegate=\"addGenre()\">\n    <option value=''>Add Genre</option>\n    <option repeat.for=\"genre of visibleGenres\" model.bind=\"genre\">${genre.name}</option>\n  </select>\n</template>\n"; });
define('text!components/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./search\"></require>\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\">\n          <span class=\"sr-only\">Toggle Navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"#\">\n          <i class=\"fa fa-book\"></i>\n          <span>${router.title}</span>\n        </a>\n      </div>\n\n      <div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation | authFilter: isAuthenticated\" class=\"${row.isActive ? 'active' : ''}\">\n            <a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a>\n          </li>\n        </ul>\n\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li if.bind=\"!isAuthenticated\"><a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\"\n            href='/#/login'>Login</a>\n          </li>\n          <li if.bind=\"isAuthenticated\"><a click.delegate=\"\" data-toggle=\"collapse\"\n            data-target=\"#skeleton-navigation-navbar-collapse.in\" href='#'>\n            <i class=\"fa fa-user fa-2x\" aria-hidden=\"true\"></i>  <span class=\"visible-xs-inline\">Profile</span></a>\n          </li>\n          <li if.bind=\"isAuthenticated\"><a click.delegate=\"access.logout()\" data-toggle=\"collapse\"\n            data-target=\"#skeleton-navigation-navbar-collapse.in\" href='#'>\n            <i class=\"fa fa-sign-out fa-2x\" aria-hidden=\"true\"></i> <span class=\"visible-xs-inline\">Logout</span></a>\n          </li>\n\n\n        </ul>\n\n\n        <div if.bind=\"isAuthenticated\" class=\"col-sm-3 col-md-3 pull-right\">\n          <search execute.call=\"searchSubmitted(query)\"></search>\n        </div>\n\n\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li class=\"loader\" if.bind=\"router.isNavigating\">\n            <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n</template>\n"; });
define('text!components/notification-convert.html', ['module'], function(module) { module.exports = "<template>\n  <h4 class=\"notification header\">${notification.text}</h4>\n  <div class=\"notification status\">Status: <span class.bind=\"notification.status\">${notification.status}<span>\n  <button class=\"btn btn-success btn-sm pull-right\" click.trigger=\"navigate()\" if.bind=\"isReady\">Download Me</button>\n  </div>\n</template>\n"; });
define('text!components/notification-metadata.html', ['module'], function(module) { module.exports = "<template>\n  <h4 class=\"notification header\">${notification.text}</h4>\n  <div class=\"notification status\">Status: <span class.bind=\"notification.status\">${notification.status}<span>\n\n  <button class=\"btn btn-success btn-sm pull-right\" click.trigger=\"navigate()\" if.bind=\"isReady\">Process Me</button>\n  </div>\n</template>\n"; });
define('text!components/notifications-drawer.html', ['module'], function(module) { module.exports = "<template>\n\n    <div id=\"drawer-notifications\" class=\"drawer drawer-right dw-xs-10 dw-sm-6 dw-md-4 fold\" aria-labelledby=\"drawer-notifications\">\n        <div class=\"drawer-controls notifications-btn\" css=\"display:${notif.empty?'none':'block'}\">\n            <a href=\"#drawer-notifications\" data-toggle=\"drawer\" aria-foldedopen=\"false\"\n            aria-controls=\"drawer-notifications\" click.delegate=\"drawerMove()\">\n            <i id=\"drawer-icon\" class=\"fa fa-comment ${attention?'attention':''}\" aria-hidden=\"true\"></i></a>\n        </div>\n        <div class=\"drawer-contents\">\n            <div class=\"drawer-heading\">\n                <h2 class=\"drawer-title\">Notifications</h2>\n            </div>\n\n            <ul class=\"drawer-nav\">\n                <li repeat.for=\"n of notif.items & throttle\" role=\"presentation\">\n                <!--<a data-toggle=\"drawer\" data-target=\"#drawer-notifications\" href=\"#\">${n.text}</a> -->\n                <compose model.bind=\"n\" view-model=\"components/notification-${n.task}\"></compose>\n\n              </li>\n\n            </ul>\n\n        </div>\n    </div>\n</template>\n"; });
define('text!components/search.html', ['module'], function(module) { module.exports = "<template>\n<form class=\"navbar-form\" role=\"search\" submit.delegate=\"executeSearch()\">\n    <div class=\"input-group\">\n        <input type=\"text\" class=\"form-control\" placeholder=\"Search\" value.bind=\"query\">\n        <div class=\"input-group-btn\">\n            <button class=\"btn btn-default\" type=\"submit\"><i class=\"glyphicon glyphicon-search\"></i></button>\n        </div>\n    </div>\n</form>\n</template>\n"; });
define('text!pages/author.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/ebook-panel\"></require>\n  <section>\n    <h2 class=\"page-title\">Books for author ${author.first_name} ${author.last_name}</h2>\n    <div class=\"row\">\n      <div class=\"col-lg-6\">\n        <div class=\"input-group \">\n          <span class=\"input-group-addon\" id=\"sizing-addon2\"><i class=\"glyphicon glyphicon-filter\"></i></span>\n          <input type=\"text\" value.bind=\"filter & debounce:850\" class=\"form-control\" placeholder=\"Filter titles by typing ...\">\n\n      </span>\n\n        </div>\n      </div>\n    </div>\n    <ebook-panel loader.bind=\"loader\"></ebook-panel>\n  </section>\n</template>\n"; });
define('text!pages/ebook-edit.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors-edit\"></require>\n  <require from=\"components/genres-edit\"></require>\n  <require from=\"components/autocomplete/autocomplete\"></require>\n  <require from=\"components/error-alert\"></require>\n  <section>\n    <h2 class=\"page-title\">Edit Ebook</h2>\n    <error-alert error.bind=\"error\"></error-alert>\n    <div class=\"\">\n      <div class=\"form-group\" id=\"title-input-group\">\n\n        <label class=\"control-label\">Title</label>\n        <input class=\"form-control\" type=\"text\" value.bind=\"ebook.title\">\n      </div>\n\n      <div class=form-group id=\"authors-input-group\">\n        <label class=\"control-label\">Authors</label>\n        <authors-edit authors.bind=\"ebook.authors\"></authors-edit>\n      </div>\n\n      <div class=\"form-group\" id=\"series-input-group\">\n        <label class=\"control-label\">Series</label>\n        <div class=\"row composed-control\">\n          <div class=\"col-xs-8\">\n            <label>Title</label>\n            <autocomplete loader.bind=\"seriesLoader\" value-key=\"title\" suggestion-template=\"./autocomplete-series.html\" value.bind=\"_series\"\n            selected-value.bind=\"_seriesSelected\" additional-class=\"form-control\"></autocomplete>\n          </div>\n          <div class=\"col-xs-4\">\n            <label>#</label>\n            <input type=\"text\" class=\"form-control\" placeholder=\"Index in Series\" value.bind=\"ebook.series_index\">\n          </div>\n        </div>\n      </div>\n\n      <div class=\"form-group\" id=\"language-input-group\">\n        <label class=\"control-label\">Language</label>\n        <select value.bind=\"ebook.language.id\" class=\"form-control\">\n          <option value=''>Select Language</option>\n          <option repeat.for=\"language of _languages\" model.bind=\"language.id\">${language.name}</option>\n        </select>\n      </div>\n      <div class=\"form-group\" id=\"genres-input-group\">\n        <label class=\"control-label\">Genres</label>\n        <genres-edit all-genres.bind=\"_genres\" genres.bind=\"ebook.genres\"></genres-edit>\n      </div>\n     <div class=\"form-group\">\n       <button type=\"button\" class=\"btn btn-primary btn-lg\" click.delegate=\"save()\">Save</button>\n       <button type=\"button\" class=\"btn btn-default btn-lg\" click.delegate=\"cancel()\">Cancel</button>\n       <button type=\"button\" class=\"btn btn-default btn-lg\" click.delegate=\"delete()\" if.bind=\"canDelete()\">Delete</button>\n     </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!pages/ebook.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors\"></require>\n   <require from=\"components/genres-converter\"></require>\n   <require from=\"components/context-menu/context-menu\"></require>\n   <require from=\"components/rating/rating\"></require>\n  <section>\n    <h2 class=\"page-title\">\n      <span class=\"title\">${ebook.title}</span>\n      <span class=\"actions\">\n      <a route-href=\"route: ebook-edit; params.bind: {id:ebook.id}\" if.bind=\"isEditable\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i></a>\n    </span>\n    </h2>\n    <authors authors.bind=\"ebook.authors\"></authors>\n    <div class=\"ebook-panel\">\n    <div class=\"ebook-cover-big\" id=\"cover-holder\">\n    </div>\n    <div class=\"ebook-details\">\n    <ul class=\"list-group ebook-properties\">\n      <li class=\"list-group-item\">\n        <label class=\"ebook-detail-label\">Language:</label>\n        <span class=\"ebook-language\">${ebook.language.name}</span>\n      </li>\n      <li class=\"list-group-item\" if.bind=\"ebook.series\">\n        <label class=\"ebook-detail-label\">Series:</label>\n        <span class=\"ebook-detail-value\">${ebook.series.title} #${ebook.series_index}</span>\n      </li>\n      <li class=\"list-group-item\">\n        <label class=\"ebook-detail-label\">Genres:</label>\n        <span class=\"ebook-detail-value\">${ebook.genres | genres}</span>\n      </li>\n      <li class=\"list-group-item\">\n        <label class=\"ebook-detail-label\">Rating:</label>\n        <span class=\"ebook-rating\"><rating size=2 rating.bind=\"ebook.rating\"></rating></span>\n      </li>\n      <li class=\"list-group-item\">\n        <label class=\"ebook-detail-label\">Created:</label>\n        <span class=\"ebook-date\">${ebook.created}</span>\n      </li>\n      <li class=\"list-group-item\">\n        <label class=\"ebook-detail-label\">Find Details On:</label>\n        <a if.bind=\"ebook.language.code=='cs'\" class=\"ext-link\" target=\"_blank\" href=\"http://www.databazeknih.cz/search?q=${searchString}\">DatabazeKnih</a>\n        <a class=\"ext-link\" target=\"_blank\" href=\"http://www.goodreads.com/search?q=${searchString}\">GoodReads</a>\n      </li>\n      <li class=\"list-group-item\" if.bind=\"convertedSources.length\">\n        <label class=\"ebook-detail-label\">Recently Converted To:</label>\n        <a class=\"converted-sources-item\" repeat.for=\"converted of convertedSources\"\n        href=\"${client.baseUrl}/api/download-converted/${converted.id}?bearer_token=${token}\">${converted.format} </a>\n      </li>\n\n    </ul>\n  </div>\n  </div>\n    <table class=\"table\">\n      <tr><th>Format</th><th>Size</th><th>Quality</th><th>Action</th></tr>\n      <tr repeat.for=\"source of ebook.sources\">\n        <td>${source.format}</td>\n        <td>${source.size}</td>\n        <td><rating rating.bind=\"source.quality\" read-only=\"1\"></rating></td>\n        <td class=\"ebook-actions\"><a if.bind=\"canDownload\" href=\"${client.baseUrl}/api/download/${source.id}?bearer_token=${token}\" title=\"Download File\">\n            <i class=\"fa fa-download source-action\"></i></a>\n          <a if.bind=\"canConvert\" href=\"#\" click.delegate=\"menuConvert.show($event, source)\"\n            title.bind=\"source.error || 'Convert'\"><i class=\"fa fa-cog source-action ${source.active? 'fa-spin':''} ${source.error?'text-danger':''}\"></i></a>\n          <a if.bind=\"true\" href=\"#\" click.delegate=\"deleteSource(source)\" title=\"Delete File\"><i class=\"fa fa-minus-circle source-action\"></i></a>\n        </td>\n      </tr>\n    </table>\n    <context-menu items.bind=\"[{text:'epub', value:'epub'}, {text:'mobi', value:'mobi'}]\" title=\"Convert to\"\n    view-model.ref=\"menuConvert\" action.bind=\"convertSource\"></context-menu>\n  </section>\n\n</template>\n"; });
define('text!pages/ebooks.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/ebook-panel\"></require>\n  <ebook-panel loader.one-time=\"loader\"></ebook-panel>\n</template>\n"; });
define('text!pages/login.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/error-alert\"></require>\n  <div class=\"container\">\n  <h2 class=\"page-title\">${title}</h2>\n  <error-alert error.bind=\"error\"></error-alert>\n  <form submit.trigger=\"login()\">\n\n      <div class='form-group'>\n      <label class=\"login-label\">Login Name</label>\n      <input class=\"form-control\" type=\"text\" value.bind=\"email\" placeholder=\"Your Login Name (email)\">\n    </div>\n    <div class=\"form-group\">\n      <label class=\"login-label\">Password</label>\n      <input class=\"form-control\" type=\"password\" value.bind=\"password\" placeholder=\"Password\">\n    </div>\n      <input type=\"submit\" value=\"Log in\" class=\"btn btn-primary\">\n  </form>\n    </div>\n</template>\n"; });
define('text!pages/search.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/ebook-panel\"></require>\n  <section>\n    <h2 class=\"page-title\">Search result for ${query}</h2>\n    <ebook-panel loader.bind=\"loader\" sortings.bind=\"[]\"></ebook-panel>\n  </section>\n</template>\n"; });
define('text!pages/upload-result.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors\"></require>\n  <require from=\"components/list-converter\"></require>\n  <require from=\"components/error-alert\"></require>\n  <require from=\"components/search\"></require>\n  <require from=\"components/ebook-action-list\"></require>\n  <section>\n    <h2 class=\"page-title\">Upload Results</h2>\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Extracted Metadata</h3>\n      </div>\n\n      <div class=\"panel-body\">\n\n          <div class=\"ebook-cover-big\" id=\"cover-holder\"></div>\n          <div class=\"ebook-meta\">\n            <div>\n              <label>File:</label>\n              ${file}\n            </div>\n            <div>\n              <label>Title:</label>\n              ${meta.title}\n            </div>\n            <div if.bind=\"meta.series\">\n              <label>Series:</label>\n              ${meta.series.title} #${meta.series_index}\n            </div>\n            <div>\n              <label>Authors:</label>\n              <authors linked.bind=\"false\" authors.bind=\"meta.authors\"></authors>\n            </div>\n            <div>\n              <label>Genres:</label>\n              ${meta.genres | list:\"name\"}\n            </div>\n            <label>Language:</label>\n            ${meta.language.name || meta.language.code}\n          </div>\n\n      </div>\n    </div>\n\n    <error-alert error.bind=\"error\"></error-alert>\n    <div class=\"panel panel-default\" if.bind=\"ebooksCandidates\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Existing Matching Ebooks</h3>\n      </div>\n      <div class=\"panel-body\">\n        <p>Based of file metadata we think it can be one of these ebooks:</p>\n        <ebook-action-list action-name=\"Add Here\" ebooks.bind=\"ebooksCandidates\" action.bind=\"addToEbook\"></ebook-action-list>\n      </div>\n    </div>\n    <div class=\"panel panel-default onpage-search\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Search Existing Ebooks</h3>\n      </div>\n      <div class=\"panel-body\">\n        <p>Search for ebook to add this file to</p>\n        <search execute.bind=\"search\"></search>\n        <ebook-action-list action-name=\"Add Here\" ebooks.bind=\"ebooksSearched\" action.bind=\"addToEbook\"></ebook-action-list>\n    </div>\n\n    </div>\n    <button class=\"btn btn-lg btn-default\" click.delegate=\"createNew()\">Create New Ebook (for this file)</button>\n  </section>\n</template>\n"; });
define('text!pages/upload.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/rating/rating\"></require>\n  <div class=\"container\">\n  <h2 class=\"page-title\">Upload Ebook</h2>\n  <p>Upload ebook file - it'll be analyzed and you'll be notified when it'll be\n    ready be included into collection </p>\n<form id=\"file-upload-form\" enctype=\"multipart/form-data\">\n  <div class='form-group'>\n  <input type=\"file\" name=\"file\" id=\"file-input\" change.trigger=\"checkFile()\">\n</div>\n<div if.bind=\"fileOK\">\n  <div class='form-group'>\n    <label>File Quality (spellling, formatting, pictures, etc.)</label>\n    <rating size=2 rating.bind=\"rating\"></rating>\n  </div>\n  <div class='form-group'>\n  <button class=\"btn btn-primary\" click.trigger=\"upload()\">Upload</button>\n  </div>\n</div>\n</form>\n<div class='uploading-progress' if.bind=\"checking\">\n  <i class=\"fa fa-spinner fa-spin fa-fw\"></i> Checking file please wait ...\n</div>\n\n<div class='uploading-progress' if.bind=\"uploading\">\n  <i class=\"fa fa-spinner fa-spin fa-fw\"></i> Uploading file please wait ...\n</div>\n<div class=\"panel panel-danger\" if.bind=\"uploadError\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">Upload Error!</h3>\n  </div>\n  <div class=\"panel-body\">\n    ${uploadError}\n  </div>\n</div>\n<div class=\"\" if.bind=\"uploadId\">\n  <p>File was successfully upload to server.  Now file has to be analyzed, it can take a while.\n    Wait for notification.\n  </p>\n</div>\n</div>\n</template>\n"; });
define('text!pages/welcome.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"container-fluid\">\n    <div class=\"jumbotron\">\n      <h1>Welcome in MyBookshelf2!</h1>\n      <p>This is web based platform for managing and sharing ebooks</p>\n      <p if.bind=\"1\"><a class=\"btn btn-primary btn-lg\" href=\"#\" role=\"button\">Learn more</a></p>\n    </div>\n  </div>\n</template>\n"; });
define('text!test/test-page.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/autocomplete/autocomplete\"></require>\n  <require from=\"components/context-menu/context-menu\"></require>\n  <require from=\"components/rating/rating\"></require>\n  <p click.delegate=\"menu1.show($event)\"> Context menu Show</p>\n  <context-menu  view-model.ref='menu1' items.bind=\"[{text:'Item 1', value:1}, {text:'Item 2', value:2}, {text:'Item 3', value:3}]\"></context-menu>\n  <rating size=\"2\" rating.bind=\"40\"></rating>\n  <rating size=\"2\" rating.bind=\"70\" read-only=\"1\"></rating>\n  <h3> Countries (loader is an array)</h3>\n  <autocomplete loader.bind=\"['Afghanistan','Albania','Algeria','Andorra','Angola','Anguilla','Antigua &amp; Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas'\n  \t\t,'Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia &amp; Herzegovina','Botswana','Brazil','British Virgin Islands'\n  \t\t,'Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Chad','Chile','China','Colombia','Congo','Cook Islands','Costa Rica'\n  \t\t,'Cote D Ivoire','Croatia','Cruise Ship','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea'\n  \t\t,'Estonia','Ethiopia','Falkland Islands','Faroe Islands','Fiji','Finland','France','French Polynesia','French West Indies','Gabon','Gambia','Georgia','Germany','Ghana'\n  \t\t,'Gibraltar','Greece','Greenland','Grenada','Guam','Guatemala','Guernsey','Guinea','Guinea Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India'\n  \t\t,'Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyz Republic','Laos','Latvia'\n  \t\t,'Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania'\n  \t\t,'Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Namibia','Nepal','Netherlands','Netherlands Antilles','New Caledonia'\n  \t\t,'New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal'\n  \t\t,'Puerto Rico','Qatar','Reunion','Romania','Russia','Rwanda','Saint Pierre &amp; Miquelon','Samoa','San Marino','Satellite','Saudi Arabia','Senegal','Serbia','Seychelles'\n  \t\t,'Sierra Leone','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain','Sri Lanka','St Kitts &amp; Nevis','St Lucia','St Vincent','St. Lucia','Sudan'\n  \t\t,'Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor LEste','Togo','Tonga','Trinidad &amp; Tobago','Tunisia'\n  \t\t,'Turkey','Turkmenistan','Turks &amp; Caicos','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Virgin Islands (US)'\n      ,'Yemen','Zambia','Zimbabwe']\" value.bind=\"country\">\n  </autocomplete>\n  <p>Selected country is ${country}</p>\n  <h3> Series (loader is fetching values from API)</h3>\n  <autocomplete loader.bind=\"loaderSeries\" value-key=\"title\" suggestion-template=\"./autocomplete-series.html\" value.bind=\"series\"\n  selected-value.bind=\"seriesSelected\"></autocomplete>\n  <p>Selected series is ${series} and selected value is ${seriesSelectedRepr}</p>\n  <h3> Ebooks (loader is fetching values from API)</h3>\n  <autocomplete loader.bind=\"loaderEbooks\" value-key=\"title\" suggestion-template=\"./autocomplete-ebooks.html\" value.bind=\"ebook\"></autocomplete>\n  <p>Selected ebook is ${ebook}</p>\n  <h3>Authors</h3>\n  <autocomplete loader.bind=\"loaderAuthors\" value-key.bind=\"getFullName\" suggestion-template=\"./autocomplete-authors.html\" value.bind=\"author\"></autocomplete>\n  <p>Selected author is ${author}</p>\n  <div click.delegate=\"menu1.show($event)\" style=\"background-color:lightgrey\"> Show menu </div>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n  <p> Lorem i psum bla </p>\n</template>\n"; });
define('text!components/autocomplete/autocomplete-authors.html', ['module'], function(module) { module.exports = "<template>\n  ${last_name}<span if.bind=\"first_name\">, ${first_name}</span>\n</template>\n"; });
define('text!components/autocomplete/autocomplete-ebooks.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors\"></require>\n  <div class=\"ebook-title\">${title}</div>\n  <div class=\"ebook-series\" if.bind=\"series\">${series.title} #${series_index}</div>\n  <authors authors.one-time=\"authors\" compact.bind=\"true\" linked.bind=\"false\"></authors>\n</template>\n"; });
define('text!components/autocomplete/autocomplete-series.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"components/authors\"></require>\n  <div class=\"ebook-title\">${title}</div>\n  <authors authors.one-time=\"authors\" compact.bind=\"true\" linked.bind=\"false\"></authors>  \n</template>\n"; });
define('text!components/autocomplete/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n  <div class=\"autocomplete-container\">\n    <input class=\"autocomplete-input ${additionalClass}\" autocomplete=\"off\" value.bind=\"value & debounce:850\" blur.trigger=\"hideSuggestions()\"\n    keydown.delegate=\"keyPressed($event)\" placeholder.bind=\"placeholder\">\n    <div class=\"autocomplete-suggestion\" style=\"display:none\">\n      <div class=\"list-group\">\n        <a data-index=\"${$index}\" class=\"list-group-item ${$index == _selected ? 'active' : ''}\" repeat.for=\"item of _suggestions\" mousedown.delegate=\"select($index)\">\n          <span if.bind=\"! suggestionTemplate\">${item}</span>\n          <compose if.bind=\"suggestionTemplate\" view.bind=\"suggestionTemplate\" view-model.bind=\"item\"></compose>\n        </a>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!components/context-menu/context-menu.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./context-menu.css\"></require>\n  <div class=\"context-menu\" css=\"display:none;width:${width}px\">\n    <div class=\"list-group\">\n      <div class=\"list-group-item header\">${title}</div>\n      <a class=\"list-group-item item\" repeat.for=\"item of items\" click.delegate=\"select(item)\">${item.text}</a>\n    </div>\n  </div>\n</template>\n"; });
define('text!components/pagination/pager.html', ['module'], function(module) { module.exports = "<template>\n  <nav>\n  <ul class=\"pager\">\n    <li if.bind=\"!isFirstPage\"><a href=\"#\" click.delegate=\"prevPage()\"\n      title=\"Page ${prevPageNo}\"><i class=\"fa fa-caret-left\"></i> Previous</a></li>\n    <li if.bind=\"!isLastPage\"><a href=\"#\" click.delegate=\"nextPage()\" \n       title=\"Page ${nextPageNo}\">Next <i class=\"fa fa-caret-right\"></i> </a></li>\n  </ul>\n  <div style='width:100%'>\n    <span class=\"pager-spinner\"  if.bind=\"loading\"><i  class=\"fa fa-spinner fa-spin fa-2x\"></i></span>\n  </div>\n</nav>\n</template>\n"; });
define('text!components/pagination/sorter.html', ['module'], function(module) { module.exports = "<template>\n  <select value.bind=\"sort\">\n    <option repeat.for=\"sorting of sortings\" value=\"${sorting.key}\">${sorting.name}</option>\n  </select>\n</template>\n"; });
define('text!components/rating/rating.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./rating.css\"></require>\n  <div class=\"rating\" css=\"font-size: ${size}em\">\n    <i class=\"fa fa-minus-circle rating-clear\" aria-hidden=\"true\" click.delegate=\"resetRating()\" if.bind=\"!readOnly\"></i>\n    <span mouseleave.trigger=\"clearProposed()\">\n    <i class=\"fa ${star.rated || star.proposed ? 'fa-star':'fa-star-o'} ${star.proposed ? 'rating-proposed' : ''} ${star.rated ? 'rating-rated' : ''}\"\"\n     aria-hidden=\"true\" click.delegate=\"rate($index)\"\n    repeat.for=\"star of stars\" mouseover.delegate=\"propose($index)\"></i>\n  </span>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map
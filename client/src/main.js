import environment from './environment';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});
import  'bootstrap';
import 'bootstrap-drawer';
import authConfig from 'config/auth-config';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    //.feature('resources')
    .feature('components/pagination')
    .plugin('aurelia-auth', baseConfig => baseConfig.configure(authConfig))
    .feature('lib/config')
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = false;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 1045;
    });


  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

  aurelia.start().then(() => aurelia.setRoot('app'));
}

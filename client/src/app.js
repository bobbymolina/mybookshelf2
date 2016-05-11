
import {FetchConfig, AuthorizeStep, AuthService} from 'aurelia-auth';
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
//import {Configure} from 'aurelia-configuration';

const logger = LogManager.getLogger('app');
@inject(FetchConfig, HttpClient, AuthService)
export class App {

  constructor(fetchConfig, client, auth) {
  this.fetchConfig = fetchConfig;
  this.fetchConfig.configure();
  client.configure(conf => conf
      .withBaseUrl(`http://${window.location.hostname}:6006`)

      .withInterceptor({
    response: response => {
      if (response && response.status == 401) {
        logger.warn('Not authenticated!');
        this.router.navigateToRoute('login');
        throw new Error('Not autherticated!')

      }
      return response;
    }
  })

)
}
  configureRouter(config, router) {
    config.title = 'MyBookshelf2';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'pages/welcome', nav: true, title: 'Welcome' },
      {route: 'ebooks', name:'ebooks',  moduleId: 'pages/ebooks', nav:true, title:'Ebooks', auth:true},
      {route: 'login', name: 'login', moduleId:'pages/login', title:'Login'},
      {route: 'ebook/:id', name:'ebook', moduleId: 'pages/ebook', title:'Ebook', auth:true},
      {route: 'search/:query', name: 'search', moduleId:'pages/search', title: 'Search Results', auth:true},
      {route:['author/:id'], name:'author', moduleId:'pages/author', title:'Authors books', auth:true}
      /*
      { route: 'users',         name: 'users',        moduleId: 'pages/users',        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: 'pages/child-router', nav: true, title: 'Child Router' } */
    ]);

    this.router = router;
  }

  activate() {

  }

  doSearch(query) {
    this.router.navigateToRoute('search', {query:encodeURIComponent(query)});
  }
}

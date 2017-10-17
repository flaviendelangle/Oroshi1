class API {

  mainConfig = {
    url: 'http://127.0.0.1:8080/api'
  };
  
  /*
    Basic HTTP Requests
   */
  fetch = (url, data) => {
    return window.fetch(url, data).then(function(response) {
      return response.json();
    });
  };
  
  GET = (url, data) => {
    if(!data) {
      data = {};
    }
    data.method = 'GET';
    return this.fetch(url, data);
  };
  
  POST = (url, data) => {
    data.method = 'POST';
    return this.fetch(url, data);
  };
  
  PATCH = (url, data) => {
    data.method = 'PATCH';
    return this.fetch(url, data);
  };
  
  /*
    Utils
   */
  objectToFormData = (data) => {
    let form = new FormData();
    for(let key in data) {
      form.append(key, data[key]);
    }
    return form;
  };
  
  url = (pk = null) => {
    const sub_url = pk ? (pk + '/') : '';
    return this.mainConfig.url + this.config.root + sub_url;
  };
  
  
  /*
   REST API
   */
  detail_route(value, route_name) {
    value = encodeURIComponent(value);
    const url = this.url() + value + '/' + route_name + '/';
    return this.GET(url);
  };
  
  create(body) {
    const data = {
      body: this.objectToFormData(body)
    };
    return this.POST(this.url(), data);
  };
  
  list() {
    return this.GET(this.url());
  };
  
  retrieve(pk) {
    return this.GET(this.url(pk));
  }
  
  partial_update(pk, body) {
    const data = {
      body: this.objectToFormData(body)
    };
    return this.PATCH(this.url(pk), data);
  }
  
  
  /*
   Custom requests
   */
  
  retrieveOrCreate(data, route_name) {
    const send = (element) => {
      return this.detail_route(element[route_name], route_name).then((content) => {
        if(content.pk > 0) {
          return Promise.resolve({
            ...content,
            created: false
          });
        } else {
          return this.create(element).then(function(response) {
            return {
              ...response,
              created: true
            };
          })
        }
      });
    };
    
    if(!Array.isArray(data)) {
      data = [data];
    }
    let promises = [];
    for(let i=0; i<data.length; i++) {
      promises.push(send(data[i]));
    }
    return Promise.all(promises);
  };

}

export default API;
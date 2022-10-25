import Vue from "vue";

export class HttpClientService{
  static get(path, options = {}){
      return Vue.http.get(path, options);
  }

  static post(path, data){
      return Vue.http.post(path, data);
  }

  static put(path, data){
      return Vue.http.put(path,data)
  }

  static delete(path){
      return Vue.http.delete(path)
  }
}
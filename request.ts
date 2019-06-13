import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Response } from "./response";
import { BaightCommon } from 'npm-pod/baight-ng/baight-common';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';

export class Request {
  isDebug = false
  baseUrl = "http://118.24.180.230:8080/";
  //baseUrl = "http://shop.hndcit.com:6001/";
  //baseUrl = "http://192.168.0.102:8080/";

  // 创建 HTTP 请求参数，可以重载
  createHttpOptions(): object{
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }

  createResponse(value:any, error:any): Response {
    if (error) {
      let response : Response = new Response();
      response.error = error;
      if (error.error && error.error.message) {
        response.desc = error.error.message
      }
      else{
        response.desc = error.message
      }
      response.error = error;
      return response
    }
    else {
      let response : any = new Response();
      response.code = value.code;
      response.desc = value.message ? value.message : value.desc;
      response.data = value.data;
      return response
    }
  }

  processGetParameter(httpParams:object):void{
  }
  processPostParameter(httpParams:object):void{
  }
  processUploadParameter(httpParams:object):void{
  }

  // 创建 上传请求类，可以重载
  createNg2FileUploader(): FileUploader{
    return new FileUploader({    
      url: BaightCommon.joinPath(this.baseUrl, "/api/contractFile/upload"),  
      method: "POST",    
      itemAlias: "file",
      autoUpload: false
    });
  }

  constructor(public httpClient: HttpClient) {
    let locationHref = window.location.href;
    // 不是 localhost
    if (locationHref.indexOf("localhost") < 0) {
      let url = new URL(locationHref)
      url.port = "8080"
      url.pathname = ''
      this.baseUrl = String(url)
    }
  }
    
  post(path: string, params? : any, completion?: (response: Response) => void) : void {
    let paramter : any = {}
      //let paramter = new HttpParams().set('service', service);
    for (let key in params) {
      paramter[key] = params[key]
    }
    this.processPostParameter(paramter)

    if (this.isDebug) {
      console.log("reqeust: " + path);
      console.log(paramter);
    }
    this.httpClient.post<Response>(this.createRequestURLWithPath(path), paramter, this.createHttpOptions()).subscribe(value => {
      let response = this.createResponse(value, null)
      if (this.isDebug) {
        console.log("post response: " + path)
        console.log(value)
      }
      completion(response);
      // 签名过期
      if (response.code == 604) {

      }
    }, error => {
      let response = this.createResponse(null, error)
      if (this.isDebug) {
        console.log("response error: " + path)
        console.log(error)
      }
      completion(response);
    });
  }

  get(path: string, params? : any, completion?: (response: Response) => void) : void {
    this.processGetParameter(params)
    let paramter : HttpParams = new HttpParams()
    for (let key in params) {
      paramter = paramter.set(key, params[key])
    }

    let httpOptions = this.createHttpOptions()
    httpOptions["params"] = paramter
    if (this.isDebug) {
      console.log("get reqeust: " + path);
      console.log(params);
    }
    this.httpClient.get<Response>(this.createRequestURLWithPath(path), httpOptions).subscribe(value => {
      let response = this.createResponse(value, null)
      if (this.isDebug) {
        console.log("response: " + path)
        console.log(value)
      }
      completion(response);
    }, error => {
      let response = this.createResponse(null, error)
      if (this.isDebug) {
        console.log("response error: " + path)
        console.log(error)
      }
      completion(response);
    });
  }

  // delete(path: string, params? : any, completion?: (response: Response) => void) : void {
  //   let paramter : HttpParams = new HttpParams()
  //   for (let key in params) {
  //     paramter = paramter.set(key, params[key])
  //   }
  //   if (this.isDebug) {
  //     console.log("delete reqeust: " + path);
  //     console.log(params);
  //   }
  //   let httpOptions = this.createHttpOptions()
  //   httpOptions["params"] = paramter
  //   this.httpClient.delete<Response>(this.baseUrl + path, httpOptions).subscribe(value => {
  //     let response : any = new Response();
  //     response.code = value.code;
  //     response.desc = value.message;
  //     response.data = value.data;
  //     if (this.isDebug) {
  //       console.log("response: " + path)
  //       console.log(value)
  //     }
  //     completion(response);
  //   }, error => {
  //     let response : Response = new Response();
  //     response.error = error;
  //     if (error.error.message) {
  //       response.desc = error.error.message
  //     }
  //     if (this.isDebug) {
  //       console.log("response error: " + path)
  //       console.log(error)
  //     }
  //     completion(response);
  //   });
  // }

  download(path:string, params? : any, filename?:string, completion?:(success:boolean, errorResponse:Response)=>void) {
    // https://www.cnblogs.com/liugang-vip/p/7016733.html
    let paramter : HttpParams = new HttpParams()
    for (let key in params) {
      paramter = paramter.set(key, params[key])
    }
    this.processGetParameter(paramter)

    let httpOptions = this.createHttpOptions()
    httpOptions["params"] = paramter
    httpOptions["reportProgress"] = true
    httpOptions["responseType"] = "arraybuffer"
    this.httpClient.get(this.createRequestURLWithPath(path), httpOptions).subscribe((value:ArrayBuffer) => {
      var blob = new Blob([value], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      var objectUrl = URL.createObjectURL(blob);

      var a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      if (filename) {
        a.setAttribute('download', filename);
      }
      a.click();
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl); 
      if (completion) {
        completion(true, null)
      }
    }, error => {
      if (completion) {
        let arrayBuffer:ArrayBuffer = error.error
        if (arrayBuffer instanceof ArrayBuffer) {
          let blob = new Blob([arrayBuffer]);       // 注意必须包裹[]
          let reader = new FileReader();
          let ffff = this
          reader.readAsText(blob, 'utf-8');
          reader.onload = function (e) {
            let result = reader.result
            let dictionary = JSON.parse(<string>result)
            if (dictionary) {
              let response = ffff.createResponse(dictionary, null)
              completion(false, response)
            }
            else {
              let response = ffff.createResponse(null, error)
              completion(false, response)
            }
          }
        }
        else {
          let response = this.createResponse(null, error)
          completion(false, response)
        }
      }
    })

    // http://jslim.net/blog/2018/03/13/Angular-4-download-file-from-server-via-http/
    // this.http.get(url, {
    //   responseType: ResponseContentType.Blob,
    //   //search: // query string if have
    // }).pipe(map((res: any)=>{
    //   return {
    //     filename: filename,
    //     data: res.blob()
    //   };
    // }))
    // .subscribe(res => {
    //     console.log('start download:',res);
    //     console.log('start download:',res.data);
    //     var url = window.URL.createObjectURL(res.data);
    //     var a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.setAttribute('style', 'display: none');
    //     a.href = url;
    //     a.download = res.filename;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove(); // remove the element
    //   }, error => {
    //     console.log('download error:', JSON.stringify(error));
    //   }, () => {
    //     console.log('Completed file download.')
    //   });
  }

  uploadLastFileItem(fileUploader:FileUploader, parameter?:{}, completion?:(response:Response)=>void): void{
    if (fileUploader.queue.length <= 0) {
      return;
    }
    this.processUploadParameter(parameter)
    let fileItem = fileUploader.queue[fileUploader.queue.length-1]
    fileItem.onSuccess = (uploadResponse: string, status: number, headers: ParsedResponseHeaders) => {
      let value = JSON.parse(uploadResponse)
      let response = this.createResponse(value, null)
      if (this.isDebug) {
        console.log("upload response: " + fileUploader.options.url)
        console.log(uploadResponse)
      }
      completion(response);
    }
    fileItem.onError = (uploadResponse: string, status: number, headers: ParsedResponseHeaders) => {
      let error = new Error("上传错误")
      let response = this.createResponse(null, error)
      if (this.isDebug) {
        console.log("upload error: " + fileUploader.options.url)
        console.log(error)
      }
      completion(response);
    }
    fileItem.onBuildForm = (form: FormData) => {
      for (let key in parameter){
        let value = parameter[key]
        form.append(key, value)
      }
    }
    fileItem.alias = "file"
    if (this.isDebug) {
      console.log("upload request: " + fileUploader.options.url)
      console.log(parameter)
    }
    fileItem.upload()
  }

  private createRequestURLWithPath(path:string):string{
    if (path.startsWith("http")) {
      return path
    }
    else {
      return BaightCommon.joinPath(this.baseUrl, path)
    }
  }
}

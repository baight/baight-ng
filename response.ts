import { Attribute } from "@angular/core";

export class Response {
    error: any;
  
    code: number;
    desc: string;
    data: any | Object;
    static successCode = 200;
  
    isSuccess() : boolean {
      if (this.error) {
        return false;
      }
      else if (this.code == Response.successCode){
        return true;
      }
      else {
        return false;
      }
    }

    public get list(): any[] {
      if (this.data){
        return this.data.list
      }
      else {
        return []
      }
    }

    public get totalCount(): number {
      if (this.data) {
        return this.data.totalElements
      }
      else {
        return 0;
      }
    }

    public get totalPage(): number {
      return this.totalCount/10
    }
  
    message() : string {
      if (this.desc) {
        return this.desc
      }
      else if (this.error) {
        if (this.error.status == 0) {
          return "发生未知错误"
        }
        else {
          return this.error.message;
        }
      }
      else {
        return "发生未知错误"
      }
    }
  
    hasMore() : boolean {
      if (this.data) {
        let hasMore = this.data["hasMore"];
        return hasMore ? hasMore : false;
      }
      return false;
      
    }
  }

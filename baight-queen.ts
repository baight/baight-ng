import { Subject, Subscription } from "rxjs";
import { BaightStorage } from "./storage";
import { Model } from "./model";
import { Request } from "./request";
import { HttpClient } from "@angular/common/http";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";

export class BaightQueen {
    public isDebug = false
    public storage = new BaightStorage()
    public request: Request

    constructor(httpClient: HttpClient, public router: Router) {
        let host : string = window.location.host;
        this.isDebug = (host.indexOf("localhost") >= 0)
        this.request = new Request(httpClient)
        this.request.isDebug = this.isDebug

        // 监听url变化
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                let now = new Date().getTime()
                if (this.navigationParamter && now - this.navigationParamterTimestamp > 2000) {
                    this.navigationParamter = {}
                }
                if (this.navigationResult && now - this.navigationResultTimestamp > 2000) {
                    this.navigationResult = {}
                }
            }
        });
    }

    // 广播通信服务
    private missionAnnouncedSource = new Subject<string>();
    private broadcast$ = this.missionAnnouncedSource.asObservable();
    broadcast(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }
    subscribe(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return this.broadcast$.subscribe(next, error, complete)
    }

    // 导航参数
    private navigationParamter = {}
    private navigationParamterTimestamp:number
    setNavigationParameter(key:any, parameter:any) {
        this.navigationParamter[key] = parameter
        this.navigationParamterTimestamp = new Date().getTime()
    }
    getNavigationParameter(key:any):any{
        return this.navigationParamter[key]
    }
    private navigationResult = {}
    private navigationResultTimestamp:number
    setNavigationResult(key:any, result:any){
        this.navigationResult[key] = result
        this.navigationResultTimestamp = new Date().getTime()
    }
    getNavigationResult(key:any):any{
        return this.navigationResult[key]
    }
    

    // 登录用户
    protected userInfo : Model
    protected userInfoKey = "loginUser"
    getLoginUser(): any {
        if (this.getToken()) {
            if (!this.userInfo) {
                this.userInfo = this.getCacheUesr()
            }
            return this.userInfo;
        }
        else {
            return null;
        }
    }
    setLoginUser(userInfo:Model) {
        this.userInfo = userInfo
        if (userInfo) {
            this.storage.setEncryptConfig(this.userInfoKey, userInfo.toString())
        }
        else {
            this.storage.setEncryptConfig(this.userInfoKey, null)
        }
    }
    // 子类重写此方法
    getCacheUesr() : any{
        let str = this.storage.getEncryptConfig(this.userInfoKey)
        if (str) {
            return this.stringToUserInfo(str)
        }
        else {
            return null
        }

    }
    stringToUserInfo(str:string): any{
        return null
    }

    private token: string = ''
    private tokenKey = 'userToken'
    getToken():string{
        if (!this.token) {
            this.token = this.storage.getEncryptConfig(this.tokenKey);
        }
        return this.token
    }
    setToken(token: string) {
        this.token = token;
        this.storage.setEncryptConfig(this.tokenKey, token)
    }
}

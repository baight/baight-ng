import {RouteReuseStrategy, DefaultUrlSerializer, DetachedRouteHandle, ActivatedRouteSnapshot} from '@angular/router';

export let kEmptyPathKey = "__empty_path_key__"

export class BaightRouteReuseStrategy implements RouteReuseStrategy {
    public static cacheRouterMap = {};

    // 方便子类重写
    shouldCache(route: ActivatedRouteSnapshot, path:string, pathComponents:string[]): boolean{
        return pathComponents.length == 1;
    }
    static cleanCacheForKey(key:string){
        delete BaightRouteReuseStrategy.cacheRouterMap[key]
    }
    static clearAllCache(){
        BaightRouteReuseStrategy.cacheRouterMap = {}
    }

    // Private Method
    pathFromRoute(route: ActivatedRouteSnapshot): string {
        let path = route["_routerState"].url;
        if (path) {
            return path
        }
        else {
            return ""
        }
    }
    cacheKeyForPath(path:string) {
        let cacheKey = path
        if (path.length == 0) {
            cacheKey = kEmptyPathKey;
        }
        return cacheKey
    }
    cacheKeyForRoute(route: ActivatedRouteSnapshot): string {
        let path = this.pathFromRoute(route)
        return this.cacheKeyForPath(path)
    }
    subCacheKeyForRoute(route: ActivatedRouteSnapshot): string {
        let result = kEmptyPathKey
        if (route.routeConfig) {
            if (route.routeConfig.path.length > 0) {
                result = route.routeConfig.path
            }
            else if (route.routeConfig.loadChildren) {
                result = route.routeConfig.loadChildren.toString()
            }
            else if (route.routeConfig.component) {
                result = route.routeConfig.component.name
            }
        }
        return result
    }
    componentOfPath(path:string){
        let result = []
        let splitArray = path.split("/")
        for (let index in splitArray){
            let component = splitArray[index]
            if (component.length > 0) {
                result.push(component)
            }
        }
        return result
    }

    // RouteReuseStrategy
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        let path = this.pathFromRoute(route)
        let pathComponents = this.componentOfPath(path)
        return this.shouldCache(route, path, pathComponents);
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // 按path作为key存储路由快照&组件当前实例对象
        // path等同RouterModule.forRoot中的配置
        let cacheKey = this.cacheKeyForRoute(route)
        let subCacheKey = this.subCacheKeyForRoute(route)
        let cacheObject = BaightRouteReuseStrategy.cacheRouterMap[cacheKey]
        if (!cacheObject) {
            cacheObject = {}
        }
        if (cacheKey && subCacheKey && handle) {
            cacheObject[subCacheKey] = handle
            if (!cacheObject[kEmptyPathKey]) {
                cacheObject[kEmptyPathKey] = handle
            }
            BaightRouteReuseStrategy.cacheRouterMap[cacheKey] = cacheObject;
        }
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // 在缓存中有的都认为允许还原路由
        return !!this.retrieve(route)
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        // 从缓存中获取快照，若无则返回null
        let cacheKey = this.cacheKeyForRoute(route)
        let subCacheKey = this.subCacheKeyForRoute(route)
        let cacheObject = BaightRouteReuseStrategy.cacheRouterMap[cacheKey]
        if (cacheObject) {
            return cacheObject[subCacheKey];
        }
        else {
            return null
        }
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // 同一路由时复用路由
        return future.routeConfig === curr.routeConfig;
    }
}
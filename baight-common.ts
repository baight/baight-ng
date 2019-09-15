export class BaightCommon {

    // yyyy：年
    // MM：月
    // dd：日
    // hh：1~12小时制(1-12)
    // HH：24小时制(0-23)
    // mm：分
    // ss：秒
    // S：毫秒
    static formatDate(date:Date, fmt:string):string{
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    static localFormatDate(date:Date, fmt:string):string{
        var localDate = this.localDate(date)
        return this.formatDate(localDate, fmt)
    }
    static localDate(date:Date):Date{
        let timestamp = date.getTime()
        var offset = date.getTimezoneOffset() * 60000;
        return new Date(timestamp - offset)
    }

    static formatMoney(number:any, places=2, symbol='', thousand=',', decimal='.') {
        if (number instanceof String){
            number = Number(number)
        }
        var negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - Number(i)).toFixed(places).slice(2) : "");
    }

    static joinPath(path0:string, path1:string): string {
        if (!path0) {
            return path1
        }
        if (!path1) {
            return path0
        }
        if (path0.endsWith("/") && path1.startsWith("/")) {
            return path0 + path1.substr(1, path1.length-1)
        }
        else if (!path0.endsWith("/") && !path1.startsWith("/")) {
            return path0 + "/" +  path1
        }
        else {
            return path0 + path1
        }
    }
    static toString(obj:any){
        if (obj != null && obj != undefined){
            return obj.toString()
        }
        else {
            return null
        }
    }
 }
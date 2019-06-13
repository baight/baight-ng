import { Base64 } from "./base64";


export class BaightStorage {
    constructor() { }

    setConfig(key:string, value:string) : void{
        if (value) {
            window.localStorage.setItem(key, value);
        }
        else {
            window.localStorage.removeItem(key);
        }
    }
    getConfig(key:string) : any{
        return window.localStorage.getItem(key)
    }
    setEncryptConfig(key:string, value:string) : void{
        let encryptKey = this.encryptString(key)
        if (value) {
            let encryptValue = this.encryptString(value)
            this.setConfig(encryptKey, encryptValue)
        }
        else {
            this.setConfig(encryptKey, null)
        }
    }
    getEncryptConfig(key:string) : any{
        let encryptKey = this.encryptString(key)
        let value = this.getConfig(encryptKey)
        return this.decryptString(value)
    }

    // 储存
    public configEncryptKey = "baight"
    encryptString(str:string) : string {
        if (str) {
        return Base64.encode(str)
        }
        else {
            return ''
        }
    }
    decryptString(str:string) : string {
        if (str) {
            return Base64.decode(str)
        }
        else {
            return ''
        }
    }
}

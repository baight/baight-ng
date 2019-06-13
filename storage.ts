import * as CryptoJS from 'crypto-js';

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
        try {
            return this.decryptString(value)
        } catch (error) {
            return null
        }
    }

    // 储存
    public configEncryptKey: string = "baight"; 
    encryptString(str:string) : string {
        return CryptoJS.AES.encrypt(str, this.configEncryptKey).toString();
    }
    decryptString(str:string) : string {
        return CryptoJS.AES.decrypt(str, this.configEncryptKey).toString(CryptoJS.enc.Utf8);
    }
}

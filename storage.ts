import * as CryptoJS from 'crypto-js';

export class BaightStorage {
    constructor() { 
        this.configEncryptKey = "baight"
    }

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
    private _configEncryptKey: string;
    private _aesKey: string;
    private _aesIV: string;
    public get configEncryptKey(): string{
        return this._configEncryptKey;
    }
    public set configEncryptKey(key: string) {
        this._configEncryptKey = key;
        this._aesKey = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(this.configEncryptKey).toString());
        this._aesIV = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(this.configEncryptKey).toString().substr(0,16));
    }
    encryptString(str:string) : string {
        return CryptoJS.AES.encrypt(str, this._aesKey, {
            iv : this._aesIV,
            mode : CryptoJS.mode.CBC,
            padding : CryptoJS.pad.ZeroPadding
        }).toString();
    }
    decryptString(str:string) : string {
        return CryptoJS.AES.decrypt(str, this._aesKey, {
            iv : this._aesIV,
            mode : CryptoJS.mode.CBC,
            padding : CryptoJS.pad.ZeroPadding
        }).toString(CryptoJS.enc.Utf8);
    }
}


export class Model {
    fromObject(obj: any) {
        for (let attr in obj) {
            this[attr] = obj[attr]
        }
    }

    toObject() : object{
        let obj = {}
        for (let attr in this) {
            if (typeof(this[attr]) != "function") {
                obj[attr.toString()] = this[attr]
            }
        }
        return obj;
    }

    toString(): string{
        return JSON.stringify(this.toObject());
    }
}

// interface Array<T> {
//     pushWithDefined(...items: Array<T | undefined>): number;
//     myMap<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
// }


// Array.prototype.myMap = function <U>(callbackfn: (value: any, index: number, array: any[]) => U): U[] {
//     const result: U[] = [];
//     for (let i = 0; i < this.length; i++) {
//         result.push(callbackfn(this[i], i, this));
//     }
//     return result;
// };

// Array.prototype.pushWithDefined = function <T>(...items: Array<T | undefined>): number {

//     const temp: T[] = [];
//     for (const item of items) {
//         if (item !== undefined)
//             temp.push(item);
//     }

//     const length = this.length;
//     for (let i = 0; i < temp.length; i++) {
//         this[length + i] = items[i];
//     }
//     return this.length;
// };


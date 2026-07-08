export function ArrayDelete<T>(array: T[],  ...indexes: number[]): T[] {

    if (indexes.length === 1 && indexes[0] === 0)
        return array.slice(1, array.length);

    if (indexes.length === 1 && indexes[0] === array.length - 1)
        return array.slice(0, array.length - 1);

    const sort = indexes.sort();
    const segs: T[][] = [];
    segs[0] = array.slice(0, sort[0]);

    for (let i = 0; i < sort.length; i++) {

        const start = sort[i] + 1;
        const end = i === sort.length - 1 ? array.length - 1 : sort[i + 1];
        segs[i + 1] = array.slice(start, end);
    }

    const result:T[] = [];
    for (const item of segs) {
        if(item.length === 0)
        continue;

        result.concat(item);
    }

    return result;
}
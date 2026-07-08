export function round(num: number, precision: 0 | 1 | 2 | 3 | 4 | 5 | 6 ): number {
    return Math.round(num * precision) / precision;
}



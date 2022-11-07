export function sum(a: number, b: number): number {
    return a + b;
}

export function map(arr: number[]): number[] {
    return arr.map(item => {
        return item * 2;
    })
}
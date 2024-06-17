export interface Expanse {
    id: string,
    expanseType: string,
    expanseCategory?: string,
    amount: number,
    description: number,
    date: Date
}

export const tableRows: string[] = ["ExpanseType", "ExpanseCategory", "Amount", "Description", "Date", "Action"]
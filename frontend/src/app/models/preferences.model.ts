export interface Questions {
    _id?: string,
    text: string,
    options: Option[],
}

export interface Option {
    text: string
}

export interface Preference {
    question: string,
    answer: string
}
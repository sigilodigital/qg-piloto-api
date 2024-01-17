export interface IConstraintSchema {
    type?: string;
    length?: number;
    minLength?: number;
    maxLength?: number;
    orLength?: number[];
    nullable?: boolean;
    default?: any;
}
export interface IConstraintSchema {
    type?: 'number'|'string'|'boolean'|'object';
    length?: number;
    minLength?: number;
    maxLength?: number;
    orLength?: number[];
    nullable?: boolean;
    required?: boolean;
    default?: (boolean|string|number|object)[];
    regex?: RegExp|string;
}
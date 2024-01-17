import { QueryRunner } from "typeorm";

export const QUERY_RUNNER_PROVIDER = {
    provide: 'QUERY_RUNNER_PROVIDER',
    useFactory: (optionsProvider: QueryRunner) => {
        return optionsProvider;
    },
    // inject: [{} as QueryRunner, { token: 'SomeOptionalProvider', optional: true }],
    //       \_____________/            \__________________/
    //        This provider              The provider with this
    //        is mandatory.              token can resolve to `undefined`.
};

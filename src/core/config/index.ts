import { env } from "@libs/common/databases/envSchema";
import { Constants } from "./constants";

export default () => ({
    enviroment: {
        name: Constants.apiName,
        version: Constants.apiVersion,
    }
});
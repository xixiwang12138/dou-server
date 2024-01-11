import {BaseInterface, get, params, post, route} from "../http/InterfaceManager";
import {Application} from "./models/Application";
import * as path from "path";
import {Contract} from "../users/models/Contract";

@route("/applications")
export class ApplicationInterface extends BaseInterface {
    @get("/")
    async getApplications() {
        return {
            applications: await Application.findAll()
        };
    }

    @get("/:appId")
    async getApplication(@params("appId") appId: string) {
        return {
            application: await Application.findByPk(appId)
        };
    }

    @get("/contract/:address")
    async getContract(@params("address") address: string) {
        return {
            contract: await Contract.findOne({where: {address}})
        };
    }
}

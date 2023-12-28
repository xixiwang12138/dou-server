import {BaseManager, getManager, manager} from "../../app/ManagerContext";
import {Application} from "../application/models/Application";


export function signMgr() {
    return getManager(SignManager)
}

@manager
export class SignManager extends BaseManager {

    // 判断是否具有签名权限
    async checkAppPerm(appId: string, redirectUrl: string,
                       operator?: string) {
        // 校验签名的应用是否存在
        const app = await Application.findByPk(appId);
        if (!app) throw "应用不存在";

        // 校验跳转的URL是否合法
        if (!app.redirectUrls.includes(redirectUrl)) throw "跳转URL不合法";

        if(operator) {
            if (!app.developers.includes(operator)) throw "没有权限";
        }

        return app;
    }
}
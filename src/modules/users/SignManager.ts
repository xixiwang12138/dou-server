import {BaseManager, getManager, manager} from "../../app/ManagerContext";
import {Application} from "../application/models/Application";
import {base64} from "ethers/lib/utils";


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

    getLoginScopes(message: string) {
        const lines = message.split("\n");

        let scopesStartIndex = 0;

        // 检查签名是否已经过期
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("Expiration")) {
                const firstSplit = line.indexOf(":");
                // 截取firstSplit后续所有字符串
                const ex = line.substring(firstSplit + 1).trim();
                const exTime = Date.parse(ex);
                const now = Date.now();
                if (exTime < now) throw "签名消息已经过期";
            }

            if (line.startsWith("Resources")) {
                scopesStartIndex = i + 1;
            }
        }

        const scopes: string[] = [];
        // 所有的scope以"-"开始，以"\n"结束，提取所有的scope
        for (let i = scopesStartIndex; i < lines.length; i++) {
            if (lines[i].startsWith("-")) {
                const scope = lines[i].substring(1).trim();
                scopes.push(scope);
            } else {
                break;
            }
        }

        return scopes;
    }
}
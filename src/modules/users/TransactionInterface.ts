import {BaseInterface, body, custom, params, post, route} from "../http/InterfaceManager";
import {auth, Payload} from "../auth/AuthManager";
import {signMgr} from "./SignManager";
import {ethers, Wallet} from "ethers";
import {User} from "./models/User";
import {AddressType, UserAddress} from "./models/UserAddress";
import {getProvider} from "../dou/constants";
import {BaseError} from "../http/utils/ResponseUtils";


@route("/transaction")
export class TransactionInterface extends BaseInterface {

    @auth()
    @post("/")
    async createTransaction(
        @body("data") data: string, // 调用数据，一个十六进制字符串
        @body("contract") contract: string, // 合约地址
        @body("appId") appId: string, // 应用id
        @body("redirectUrl") redirectUrl: string, // 回调地址
        @custom("auth") payload: Payload
    ) {
        await signMgr().checkAppPerm(appId, redirectUrl);
        const inner = await signMgr().getUserInnerAddress(payload.phone);
        return await signMgr().sendTransaction(inner.privateKey, {
            to: contract,
            data: data,
        });
    }


    @auth()
    @post("/incr/:txHash")
    async incrTransaction(
        @params("txHash") txHash: string,
        @custom("auth") payload: Payload,
    ) {
        const originalTransaction = await getProvider("devnet").getTransaction(txHash);
        if (!originalTransaction) throw new BaseError(400, "invalid txHash");

        const inner = await signMgr().getUserInnerAddress(payload.phone);

        const newGas = originalTransaction.gasPrice.mul(110).div(100);
        const newTransaction = {
            ...originalTransaction,
            gasPrice: newGas,
        };

        return await signMgr().sendTransaction(inner.privateKey, newTransaction);
    }

    @auth()
    @post("/cancel/:txHash")
    async cancelTransaction(
        @params("txHash") txHash: string,
        @custom("auth") payload: Payload,
    ) {
        const originalTransaction = await getProvider("devnet").getTransaction(txHash);
        if (!originalTransaction) throw new BaseError(400, "invalid txHash");

        const inner = await signMgr().getUserInnerAddress(payload.phone);

        const newGas = originalTransaction.gasPrice.mul(110).div(100);
        const newTransaction = {
            ...originalTransaction,
            gasPrice: newGas,
            to: inner.address,
            value: ethers.utils.parseEther("0"), // 0 ETH
        };
        return await signMgr().sendTransaction(inner.privateKey, newTransaction);
    }
}
import {BaseInterface, body, custom, post, route} from "../http/InterfaceManager";
import {auth, Payload} from "../auth/AuthManager";
import {signMgr} from "./SignManager";
import {Wallet} from "ethers";
import {User} from "./models/User";
import {AddressType, UserAddress} from "./models/UserAddress";
import {getProvider} from "../dou/constants";


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

        const user = await User.findOne({where: {phone: payload.phone}});
        const innerAd = await UserAddress.findOne({where: {userId: user.id, addressType: AddressType.Inner}});

        // 发起交易
        const wallet = new Wallet(innerAd.privateKey, await getProvider("devnet"))
        const sentTransaction = await wallet.sendTransaction({
            to: contract,
            data: data,
        });
        // 等待交易确认，并获取交易哈希
        const transactionReceipt = await sentTransaction.wait();
        const transactionHash = transactionReceipt.transactionHash;
        return {
            txHash: transactionHash
        }
    }
}
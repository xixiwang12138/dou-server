import {signMgr} from "./SignManager";

function testParse() {
    const message = `-----BEGIN SIGNED MESSAGE-----
Expiration Time: 2024-08-31T08:58:29Z
Resources:
- user.email
- user.phone`
    const scopes = signMgr().getLoginScopes(message);
    console.log(scopes);
}

function testCheckExpire() {
    const message = `-----BEGIN SIGNED MESSAGE-----
Expiration Time: 2023-08-31T08:58:29Z
Resources:
- user.email
- user.phone`
    const scopes = signMgr().getLoginScopes(message);
}

testParse()
testCheckExpire()
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
// import * as sjcl from "sjcl";
declare var require: any
var CryptoJS = require("sjcl");

@Injectable({
  providedIn: "root"
})
export class EncryptService {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
  constructor() { }
    encode(e) {
        let t = "";
        let n, r, i, s, o, u, a;
        let f = 0;
        e = this.utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            }
            else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) +
                this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }
        return t;
    }
   decode(e) {
        let t = "";
        let n, r, i;
        let s, o, u, a;
        let f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = this._utf8_decode(t);
        return t;
    }
   utf8_encode(e) {
        e = e.replace(/\r\n/g, "\n");
        let t = "";
        for (let n = 0; n < e.length; n++) {
            let r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            }
            else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            }
            else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
            }
        }
        return t;
    }

_utf8_decode(e) {
        let t = "";
        let n = 0;
        let r = 0;
        let c1 = 0;
       let c2 = 0;
       let c3;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            }
            else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2;
            }
            else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) <<
                    6 | c3 & 63);
                n += 3;
            }
        }
        return t;
    }

    encrypt(dataToEncrypt, aesPublicKey) {
        let hash = CryptoJS.hash.sha256.hash(dataToEncrypt);
        let payloadHash = CryptoJS.codec.hex.fromBits(hash);
        let ct, p;
        let timestamp = (new Date()).toISOString();
        let iv = timestamp.substr(timestamp.length - 8);
        let key = CryptoJS.codec.hex.fromBits(CryptoJS.random.randomWords(32, 0));
        p = {
            adata: "",
            iter: 1000,
            mode: "ccm",
            ts: parseInt("64"),
            ks: parseInt("256"),
            iv: this.encode(iv),
            salt: this.encode(iv)
        };
        ct = CryptoJS.encrypt(key, dataToEncrypt, p);
        ct = JSON.parse(ct);
        let encryptedRawPayload = this.encode(ct.ct);
        let encryptedRandomKey = "";
        {
            let randomCT, randomPayload;
            randomPayload = {
                adata: "",
                iter: 1000,
                mode: "ccm",
                ts: parseInt("64"),
                ks: parseInt("256"),
                iv: this.encode(iv),
                salt: this.encode(iv)
            };
            randomCT = CryptoJS.encrypt(aesPublicKey, key, randomPayload);
            randomCT = JSON.parse(randomCT);
            encryptedRandomKey = this.encode(randomCT.ct);
        }
        let headers = {
            'x-appiyo-key': encryptedRandomKey,
            'x-appiyo-hash': payloadHash,
            'x-appiyo-ts': timestamp,
            'Content-Type': 'text/html'
           
        };
        let request = {
            "rawPayload": encryptedRawPayload,
            "headers": headers
        };
        return request;
    }

    decrypt(randKey, timeStamp, responseHash, encryptedRes, aesPublicKey) {
        let decryptedKey = this.decryptAES(this.decode(randKey), aesPublicKey, timeStamp);
        let decryptedResponse = this.decryptAES(this.decode(encryptedRes), decryptedKey, timeStamp);
        let hash = CryptoJS.hash.sha256.hash(decryptedResponse);
        let payloadHash = CryptoJS.codec.hex.fromBits(hash);
        if (payloadHash !== responseHash) {
            decryptedResponse = "{message: 'Malformed response'}";
        }
        return decryptedResponse;
    }

    decryptAES(encryptedData, key, timestamp) {
        let rp = {};
        let plaintext;
        let iv = timestamp.substr(timestamp.length - 8);
        try {
           let ciphertext = encryptedData;
            let dataToDecrypt = {
                "iv": this.encode(iv),
                "salt": this.encode(iv),
                "ct": ciphertext,
                "mode": "ccm",
                "v": 1,
                "ks": 256,
                "iter": 1000,
                "adata": "",
                "ts": 64
            };
            // plaintext = sjcl.decrypt(key, JSON.stringify(dataToDecrypt), {}, rp);
            plaintext = CryptoJS.decrypt(key,JSON.stringify(dataToDecrypt), {}, rp);
        }
        catch(e) {
            console.log(e);
            return;
        }
        return plaintext;
    }
    decryptResponse(event) {
        var timestamp = event.headers.get('x-appiyo-ts')
        var randomkey = event.headers.get('x-appiyo-key')
        var responseHash = event.headers.get('x-appiyo-hash');  
        if (timestamp != null) {
          try {
            let decryption = this.decrypt(randomkey, timestamp, responseHash, event.body || event.error, environment.aesPublicKey);
            return decryption;
          }catch(e) {
            console.log(e);
          }
          return null;
    
        } else {
          return false;
        }
    
    }


    decryptMobileResponse(event) {
        var timestamp = event.headers["x-appiyo-ts"];
        var randomkey = event.headers["x-appiyo-key"];
        var responseHash = event.headers["x-appiyo-hash"];  
        if (timestamp != null) {
          try {
            let decryption = this.decrypt(randomkey, timestamp, responseHash, event.data || event.error, environment.aesPublicKey);
            return decryption;
          }catch(e) {
            console.log(e);
          }
          return null;
    
        } else {
          return false;
        }
    }




}

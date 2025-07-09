import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram
} from "https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js";

const c = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
const connect = document.getElementById("connect");
const buy = document.getElementById("buy");
const log = msg => document.getElementById("log").innerHTML += <div>> ${msg}</div>;
let user;

connect.onclick = async () => {
  if (!window.solana?.isPhantom) return alert("Phantom غير مثبت");
  const resp = await window.solana.connect();
  user = resp.publicKey;
  log(`✅ المربوطة: ${user.toString()}`);
};

buy.onclick = async () => {
  const amt = parseFloat(document.getElementById("amount").value);
  const tgt = document.getElementById("targetWallet").value.trim();
  if (!user  isNaN(amt)  !tgt) {
    return log("⚠️ تأكد من الربط، العنوان، والمبلغ");
  }
  const lamports = amt * solanaWeb3.LAMPORTS_PER_SOL;
  try {
    const tx = new solanaWeb3.Transaction().add(
      SystemProgram.transfer({ fromPubkey: user, toPubkey: new PublicKey(tgt), lamports })
    );
    tx.feePayer = user;
    tx.recentBlockhash = (await c.getLatestBlockhash()).blockhash;
    const signed = await window.solana.signTransaction(tx);
    const sig = await c.sendRawTransaction(signed.serialize());
    await c.confirmTransaction(sig);
    log(`✅ تم التنفيذ: ${sig}`);
  } catch (err) {
    log(`❌ خطأ: ${err.message}`);
  }
};

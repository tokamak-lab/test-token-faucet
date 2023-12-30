"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import createToken from "../api/createToken";
import Link from "next/link";
declare var bootstrap: any;

export default function Home() {
    const wallet = useAnchorWallet();
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [uri, setUri] = useState('');
    const [returnMsg, setReturnMsg] = useState('');


    return (
        <div className="container mt-2">
            <h1>Create token</h1>
            <div>
                <form>
                    <div className="mb-3">
                        <label htmlFor="token_name" className="form-label">Token name</label>
                        <input type="text" className="form-control" id="token_name" onChange={(e) => setTokenName(e.target.value)} value={tokenName} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="token_symbol" className="form-label">Token symbol</label>
                        <input type="text" className="form-control" id="token_symbol" onChange={(e) => setTokenSymbol(e.target.value)} value={tokenSymbol} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="uri" className="form-label">URI</label>
                        <input type="text" className="form-control" id="uri" onChange={(e) => setUri(e.target.value)} value={uri} />
                    </div>

                    {wallet && (
                        <button className="btn btn-primary"
                            type="button"
                            disabled={!tokenName || !tokenSymbol || !uri}
                            onClick={async () => {
                                const result = await createToken(wallet, tokenSymbol, tokenName, tokenSymbol, uri);
                                setReturnMsg(result?.msg!);
                                if (result?.status) {
                                    const toast_show = bootstrap.Toast.getOrCreateInstance(document.getElementById("create_success"));
                                    toast_show.show();
                                } else {
                                    const toast_show = bootstrap.Toast.getOrCreateInstance(document.getElementById("error"));
                                    toast_show.show();
                                }
                            }}>Create</button>
                    )
                    }
                    {!wallet && (
                        <p>Wallet Not Connected</p>
                    )}


                </form>

            </div>
            <div className="toast-container p-3 bottom-0 start-0" >
                <div className="toast" role="alert" aria-live="assertive" aria-atomic="true" id="create_success">
                    <div className="toast-header text-success-emphasis">
                        <div>Token&nbsp;</div>{tokenSymbol}<div>&nbsp;created successfully</div>
                    </div>
                    <div className="toast-body">
                        <div>Transaction:&nbsp;</div> <Link href={`https://solana.fm/tx/${returnMsg}?cluster=devnet-solana`}>{returnMsg}</Link>
                    </div>
                </div>
            
                <div className="toast" role="alert" aria-live="assertive" aria-atomic="true" id="error">
                    <div className="toast-header">
                        <div className="text-warning-emphasis">Transaction error</div>
                    </div>
                    <div className="toast-body">
                        <div>{returnMsg}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
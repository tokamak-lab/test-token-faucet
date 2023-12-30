"use client";

import Image from 'next/image'
import usdc_logo from '../lib/img/USDC logo.png'
import "./styles/main.css"
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import mintToken from './api/mintToken';
import Link from 'next/link';
declare var bootstrap: any;

export default function Home() {
  const wallet = useAnchorWallet();
  const [mintAmount, setMintAmount] = useState(0);
  const [returnMsg, setReturnMsg] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  return (

    <div className="container mt-3">

      <div className="row row-cols-1 row-cols-sm-2 g-3">
        <div className="col">

          <div className="card border-primary mb-3">
            <div className="card-body d-flex justify-content-between">
              <div className='d-flex object-fit-scale flex-shrink-1 me-4 align-items-center'>
                <Image src={usdc_logo} alt="USDC Logo" className='' height={100} width={100} />
              </div>

              <div className="w-100">
                <h5 className="card-title">Mint devUSDC</h5>
                <form>
                  <div className="input-group mb-2">
                    <input type="number" className="form-control" placeholder="Enter amount"
                      id='mint_amount' onChange={(e) => setMintAmount(Number(e.target.value))} value={mintAmount} />
                  </div>
                  {wallet && (
                    <button className="btn btn-primary ms-auto"
                      type="button"
                      disabled={mintAmount > 10000 || mintAmount <= 0}
                      onClick={async () => {
                        const result = await mintToken(wallet, 'devUSDC', mintAmount);
                        setTokenSymbol('devUSDC');
                        setReturnMsg(result?.msg!);
                        if (result?.status) {
                          const toast_show = bootstrap.Toast.getOrCreateInstance(document.getElementById("create_success"));
                          toast_show.show();
                        } else {
                          const toast_show = bootstrap.Toast.getOrCreateInstance(document.getElementById("error"));
                          toast_show.show();
                        }
                      }
                      }
                    >Mint</button>
                  )}
                  {!wallet && (
                    <p>Wallet Not Connected</p>
                  )}

                </form>
              </div>

            </div>
          </div>
        </div>
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

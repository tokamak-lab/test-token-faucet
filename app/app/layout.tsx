"use client";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import React, { useMemo } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import useIsMounted from "./api/utils/useIsMounted";

require('@solana/wallet-adapter-react-ui/styles.css')

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], [network]);
  const mounted = useIsMounted();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <html lang='en' data-bs-theme="dark">
            <body>
              <main>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                  <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbarLabel" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand ms-2 " href="#">Test Token Faucet</a>
                    <div className="offcanvas offcanvas-start" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                      <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Test Token Faucet</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                      </div>
                      <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                          <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Mint</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="/create">Create</a>
                          </li>
                          <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              Dropdown
                            </a>
                            <ul className="dropdown-menu">
                              <li><a className="dropdown-item" href="#">Action</a></li>
                              <li><a className="dropdown-item" href="#">Another action</a></li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                          </li>
                        </ul>

                      </div>
                    </div>
                    <div className='navbar-nav flex-row flex-wrap ms-md-auto ms-auto'>
                      <li className='nav-item col-6 col-lg-auto'>{mounted && <WalletMultiButtonDynamic />}</li>
                    </div>
                  </div>
                </nav>

                {children}

                <Script
                  src='https://cdn.jsdelivr.net/gh/twbs/examples@main/color-modes/js/color-modes.js'
                  strategy="beforeInteractive"
                />
                <Script
                  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
                  strategy='lazyOnload' />
              </main>
            </body>
          </html>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{46601:function(){},37836:function(e,a,c){Promise.resolve().then(c.bind(c,33504))},23270:function(e,a,c){"use strict";c.d(a,{p:function(){return t}});let t=[{ticker:"USDC",img:"https://cdn.moralis.io/eth/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",name:"USD Coin",address:"0x07865c6E87B9F70255377e024ace6630C1Eaa37F",decimals:6},{ticker:"DAI",img:"https://cdn.moralis.io/eth/0x6b175474e89094c44da98b954eedeac495271d0f.png",name:"Dai Stablecoin",address:"0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",decimals:18},{ticker:"WETH",img:"https://cdn.moralis.io/eth/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",name:"Wrapped Ethereum",address:"0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",decimals:18},{ticker:"USDT",img:"https://cdn.moralis.io/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png",name:"Tether USD",address:"0x509Ee0d083DdF8AC028f2a56731412edD63223B9",decimals:6},{ticker:"LINK",img:"https://cdn.moralis.io/eth/0x514910771af9ca656af840dff83e8264ecf986ca.png",name:"Chainlink",address:"0x514910771af9ca656af840dff83e8264ecf986ca",decimals:18},{ticker:"GUSD",img:"https://cdn.moralis.io/eth/0x056fd409e1d7a124bd7017459dfea2f387b6d5cd.png",name:"Gemini USD",address:"0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",decimals:2},{ticker:"WBTC",img:"https://cdn.moralis.io/eth/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",name:"Wrapped Bitcoin",address:"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",decimals:8},{ticker:"MATIC",img:"https://cdn.moralis.io/eth/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",name:"Matic Token",address:"0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",decimals:18},{ticker:"UNI",img:"https://cdn.moralis.io/eth/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",name:"Uniswap",address:"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",decimals:18},{ticker:"CRV",img:"https://cdn.moralis.io/eth/0xd533a949740bb3306d119cc777fa900ba034cd52.png",name:"Curve DAO Token",address:"0xd533a949740bb3306d119cc777fa900ba034cd52",decimals:18},{ticker:"MKR",img:"https://cdn.moralis.io/eth/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2.png",name:"Maker",address:"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",decimals:18},{ticker:"SHIB",img:"https://cdn.moralis.io/eth/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png",name:"Shiba Inu",address:"0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",decimals:18},{ticker:"AAVE",img:"https://cdn.moralis.io/eth/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",name:"AAVE",address:"0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",decimals:18}]},33504:function(e,a,c){"use strict";c.r(a);var t=c(57437),d=c(24033),s=c(2265),i=c(17669),n=c(87225),f=c(46943),r=c(13536);a.default=()=>{let{activateBrowserWallet:e,account:a,chainId:c}=(0,i.K)(),{chainName:m,setChainName:l}=(0,r.YC)(),o=(0,d.useRouter)();return(0,s.useEffect)(()=>{if(a){switch(c){case n.Du.chainId:l("Goerli");break;case n.ny.chainId:l("Mainnet")}""!==m&&o.push("/".concat(m.toLowerCase(),"/home"))}},[c,m]),(0,t.jsx)("div",{style:{height:"100vh",width:"100vw",display:"flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("div",{children:(0,t.jsx)(f.Z,{onClick:()=>{e()},className:"btn",children:"Connect Wallet"})})})}},13536:function(e,a,c){"use strict";c.d(a,{YC:function(){return f},nS:function(){return n}});var t=c(57437),d=c(2265),s=c(23270);let i=(0,d.createContext)(),n=e=>{let{children:a}=e,[c,n]=(0,d.useState)(""),[f,r]=(0,d.useState)(null),[m,l]=(0,d.useState)(null),[o,u]=(0,d.useState)(null),[b,h]=(0,d.useState)(!1),[p,x]=(0,d.useState)(!1),[g,S]=(0,d.useState)(!1),[C,k]=(0,d.useState)(0),[A,D]=(0,d.useState)(!1),[B,E]=(0,d.useState)(s.p[0]),[F,v]=(0,d.useState)(s.p[1]),[I,U]=(0,d.useState)(0),[w,T]=(0,d.useState)(0),[N,_]=(0,d.useState)(0),[j,M]=(0,d.useState)(""),[W,y]=(0,d.useState)("0.50"),[G,K]=(0,d.useState)(0);return(0,t.jsx)(i.Provider,{value:{contractAddress:c,contract:m,selectedSigner:o,isLoading:b,transactionHash:f,timeout:A,sellToken:B,buyToken:F,buyTokenAmount:I,sellTokenAmount:w,sellerTokenBalance:N,isLoadingSellerTokenBalance:p,buyTokenBalance:C,isLoadingBuyTokenBalance:g,chainName:j,fees:G,slippage:W,setSlippage:y,setFees:K,setChainName:M,setIsLoadingBuyTokenBalance:S,setBuyTokenBalance:k,setIsLoadingSellerTokenBalance:x,setSellerTokenBalance:_,setSellToken:E,setBuyToken:v,setBuyTokenAmount:U,setSellTokenAmount:T,setTimeout:D,setSelectedSigner:u,setContractAddress:n,setIsLoading:h,setTransactionHash:r,setContract:l},children:a})},f=()=>(0,d.useContext)(i)}},function(e){e.O(0,[669,404,971,938,744],function(){return e(e.s=37836)}),_N_E=e.O()}]);
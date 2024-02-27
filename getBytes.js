/* 
    Relies on a set string to generate an identical string every time.
    [ A little play with repeatable obfuscation. ]
    Reads the url parameters to select chunks of data from a set string.
    ?s=0&c=24&o=0 will start at the beginning, create chunks of 24 and deliver every 2nd chunk until the end of the string.
    Example http://localhost/textGen/?s=29&c=33&o=1&p=234567

    OPTIONS
        s: Start offset = Number
        c: chunk size = Number
        o: 1=Odd / 0=Even / 2=All chunks
        p: suffix each chunk with this. String

    This could also be used to generate your password logins, if only you know the parameters.
    Remote hosting would have logs of parameters used, so run this locally only.
*/

"use strict";

// If _content changes then every run of the script changes!! 
// The aim here is for a consistent repeatable pattern. Like what would be used as a Veracrypt keyfile.
const _content = 'Qh6wQ3kda8GJIA%33zsqGt=8JZWAPdvSnv221Y6Rte^QX5^iSs1=888qO%XplXB8h1c5u4RWUCsL71lsBZii1WB^qdA5gnloFmIcpNs02WnWuH7O69CMew%E8fQB3nnHFI9Sbl3+7zu4GFXpkE%M1CXydh_TNm6R8jquyZ+b_RFcGUbPNbT2s9M=T_vcLXl2g3dB6WygX3rl6i7^dd8JRsNB6G+jcPDQw6LsFCh2W%TofC71BSAaS8xu=7g82dykwOo0aeg5TBh3TAzmzQV4chJT1W_347BrZGPW51EgnFCElU38oXOoC9IYJZK25bvl2lbgFBL6i2B5Gq34djcO^5kMhRR7KLs5K6N2CQr4UcnQp_I99^yjWtTDrikhjxMm%4%aM4pcUsNAO_kj+4LOnLJW+q1MZP5mh1%3Vr4q7QR4xyGWweRzd+WwpqKQ5iLclpGTH84LsHSOhFT0WjmqnZ6hKt^a+k_MoKfwGNiBDEwMfgX9IdO7samfnjknUi5X59Swl7WNnVx^3FS+OtA_0lG322Dd^87ohXWO6W8i3uLEoF11ICyFm6UlvnTXWj%ydmIWA4_n7ZKg7X6BPDslC+8sA+sQ_^6xOK3V4da+6+f5x5IDr5PMWQUd3hw6E4^b4Lh506AXRzcBC=miV6S4jXU165avUpOx_M3WG3K_9TXlw%g7qgOWZflp7%Xo_O15rj9S0llHsHcdzb^^WLl8cmtbTG72Q85Bebshexh5vxCK9BkL9odv3wWxWAcyq0PEhi60BVj7Q=5fsk^12ugGXgzNeRaxydZ1Xc^4%Jv=_UX6QR=fe4yg2H8jbqGxQhvMuj474rJqBxKPIDcHkJf4TGBChUVXLzSqX^CwZEAWBAxBZThrJn_K2Yb49USqraQ7LVRScZ%O_Hr+Aozqj=ZfAkG9TBZrNqXqPHDI%jDv58huIdJZ_GMFuKJji9BJS_kzAHez0i3q57Wq4i1xldtEuqisBCxf3fzFk8aF3w8fAe2=QHCVjgr2cqeJ2HIVZqCejr%KPCIFYjRaM_nnLfam8sTCljkyQkO8K+ck3B9IZRuIo3RW=3MRDDUFPcEh+2vOlEL02_eTe1dd^^MS2nq0b2neABIVUV5q^dFmEqNCUEd_rnXygNAqgHS^x%dTiELGUz6%%jdjCnyeBDT9q2+cHkRQqP6UvAHX=GcXp^Y+49ApXS_z=UrdY=IptYHjn%sisgeS8Ic+i0PaBaFxbbhrkY^gQ1RKHiY5Bsfk_AJkD3ojm67_w+9uCsjYgo9E0^sYdXQFF+UcVI=5AWoKNzLnd_ABL3xU7JFYcyt3_3m7x2AFP4_vLp_=_DGa751=4Ctyg11O_XYWxwKd5QPQBWsfh=Y8WNx+Rzt^MKS^z_U3ZHfQ67etxIXTU38j2^p+VyJyHqrN%DGKQ_VxJwq=o^^zawf2T2BHOL8fs524kIzc+aF_cdFxS6FAAIal_5ZoSXfqx+2x3s55q1^ZZEjxWp6GbL=KfOROeU^e4^ktXrqW+1DFxJPkR2LG_dwrzfqdwoRfD%gJtaUk2GW^iiEkXF9xWtvjTERL99sZEvp4Tb+=Liqc5hE9AGp3epzN_kxh854Lq^HUOi8bXehmnSKrjJokANPko2bECfZn_U_HWlY_W%nUaZyu5qq2JPQm6vTYw+8EXQ_pFT9L^yu^=GdGBVzKMOtucGZ%%hTk7pk^6n+b0O7C4bHZlpXenRdcmjeJ=Od7OuCK5je25qmT_cJOQTu=lEL8sJQL%j0mYWMLtuZZSW+AK9MNkTkQIfewl8zyM6R=S6HBYmL4FzNnk^HYFHb_IuMDw^+p2GAjHC1^fsWDMzZ3tlzKLz3w9RQ1JSAglLV%=C%lpyc7BMfPGZvkYFHCBzyyr4wuhlJq%Cpc8sE24G_tnpIcC+ZgiB%iGgnd_Nn4djb7duS9h96DhqMc=SGEe5AapZSpsCx%f6o++dDnou+4erQ=iEjSVzOUcKYrCY_HrgEtPq+vdm06k+pZA1kuqRHZ4VJZZfsyl9uK7G95B8RYU^c=MF9eGad%yAIKssLu%_SodzyHqmH3mb3fvhUwXm=zDQhqBYGu+mE3z0eMH0YEQSJma9GY3ZqliiBC+0wZ6fytrj0aSffkFX%RGpVoYrE1hk3uIYNNZQr36OaMCyeN%qQBqBH_w00OcX_Nq3zmDOnCPWcR4vUZjYDEJjq26x1Us7Slhym_xccfKrxyXTMtLpeZm5XX2XOPjr_oHZzPRZo%nqW9V35afgWJ5BI6V1rN=I+1KXq02f1SC1ggvPPfY9E^6Ckx%H4V13Qj+Lsp^mf_72Y%sccRQKWK8ImJ7=m0=t70khwlgfrGMFL0y^n6nyg4jXCIQtgQ1sdVP64tSet9cP%A2nYw5+CTBg3EZUDduMEaUdfmxHZMFdRzCKSRdDmnItiqtT%hZ%+jjcriw_DJIZn1CaHVAdR5fejRf5kPw4I5ASx%8Bz_Y84TKXRgEMWfOoCGyV2sBvRqezvyG7umLfdSiJYur19BvMq^0aVOL9Sd2V5w_DYGxpmHhd%rF2+ycCuNoT_gZ9LFqdfDbneIFqQv^7AHI94vFX%YmB+8s3KiF3SxDxQz9lqFGlhMtqPeQn8Ydn9eHfNL2hdb4%QFWRwwBzTuW^sbKrvBPO6spmFTQmtaMpq5s1=flVFVLaPf+axBcFzaRp^+_dQxxYmxe+Iqz+kttA^IfraW1mE2GWGR8%QDIwntvBdEThd3_JXzhWqkFSEqsIY7R0dbjZ6AyklFdw6Dcc0^5CZ6ZRw8fdqHUqb81nZYai+nfe4a^9ZlG%Ggu2nU%ZgHCz_l13W0AaUy+BB%ORfz%2suXshYigYiMDRMMIHEfeCrsO7%6Psa7%6YQQE2jf8GJYD=ikOiRc^5AYKeDX9xPout2KXe+O=74um6rE%lTuasRx8kpp=NObGnlO%hT33bzpaj4KG1IcB2^bIlqtGq0^EjHOiFD0KbI%03VWolOmu8sGBak3wCVTCL+rZICe^wboi_nzdRQstLGIAz=M%p2lXoT%SfCo^^IM1Ixf12L9=7bI_009b7XWD9dQmQuO_4i94p9uu^d68+sLdiyVSqRI+9Ab0ZeGWA5Xa=3+ipl6lLmVzOKhTiJWFX+w4snFkhlex6Axs1PZ58bfLrKBIvSuDFrpNeDcigtpMF5G3TpghwyKwH1kFfAioJ6JWKq0D^y8koBuG+hbhci6JM%60+vQjBP4FQPMCKFJHCzRkvbeB3HnPjGCCnRcofKK2n+Ntnf_BGevqzMBNQ^aA8T_m7lviS_eejcAtkIo+d=9yLhtw6Y_3ZpQOyMMW8_70UNO4uObDQFLVivCFtzjkycWlG3vX2UXGpsjmCILFgvKhLB6sEfj00hwhbfIzCUpCZ=^Dxii6otHXnOunmrfvbQz4o0_ki9e0fNKb5jhpckAS1uaFssQgHNSSmf2Dxy32tv5A8pHmlnCcmalq6591DH3dulKGN+9njFoNsWE1xhDgV8IfYfgu%YeV0EBV9ybG++BEUJUnEh5OMBfNP6nJQZGt_G8J4NDAo_bPP2h1aR^myp_s2i0fq_NNC5rMzctcwY_Afsvp^T1Erh%vnatBZOhc1hMyS+XLEcSUtAp7zA9L%PP7wNHzfUb+uzQo3%SZIf8S8oGDak5YFfOkwiUkz8R9HRR5nSaJwL7fdVCmCM3YtI3dd%7ak2yOqeqnmMLYw6F0MQB=F%b5KUhv%ME=PlMGWKSuB^PnScgA9auzurQyNWBTzAAy8HKh5iU4hEJIO0^0bpVjFiw%9wzh1baM3nDO6b%gCT0U4+fdXHXmmSTRbF0ZJtXXfHc=kZUAE7MfrbQXk0+s0SBk+Oc_q3xJSpbh2wVLtyIT%CE83ImcyPfygMoSR9+puZkvSL=Lne4YIBgTG3pa1JmFO3Gz+9Vbg6BFvyou21J%9r7ha3ea^a6QFnTM7Xb1nojHZ6I8DaRGBZQmEHh_COS%TKREMr5AEowp%h%2+EiUaj58QUCekCYgw9jk94gpMNZ+5+AmAaL6+qc344jQnhxva5e_dDHtR=C5tCLYgbJajVaoczDhTCNafYAMyzk%CFq5cyTLoM4Z_BSNCf8SfeQI1^'
/*
Generate your own string in linux: 
$ head -c 100000 /dev/urandom | tr -dc A-Za-z0-9\^\-_+=\% | head -c 8192; echo ''
That in itself could be used as a keyfile. But How do you recreate it again? It's random.
*/

const _strLength = _content.length;

const _display = document.getElementById('textGenerator');

//get url params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// set options or defaults
let checkQuery = (_param, _default) => {
    if(urlParams.has(_param) && !isNaN(urlParams.get(_param)))  
        return Number(urlParams.get(_param)); // This is treated as a String from the URL?.
    else 
        return _default;
}
// writes out the chunks
let writeContent = _txt => {
    //document.write(_txt + _padding);
    _display.innerHTML += _txt + _padding;
}

const _start = checkQuery('s', 1);
const _chunk = checkQuery('c', 100);
const _order = checkQuery('o', 0); // 1=odd, 0=even, 2=all
let _padding = urlParams.get('p') || ""; // seperator for each section

let _count = Number(_start); // slice startpoint
let _iter = 0; // loop count
let _tmp = "";

while (_count < _strLength) {

    _tmp = _content.slice(_count, (_count + _chunk));

     // TODO: BELOW CAN BE DONE BETTER!
    if (_iter%2 > 0 && _order == 1) 
    { // odd
       writeContent(_tmp);
    } 
    else if (_iter%2 == 0 && _order == 0) 
    { // even
        writeContent(_tmp);
    } 
    else if (_order == 2)
    { // all
        writeContent(_tmp);
    }

    _iter++;
    _count += _chunk; // next block
}

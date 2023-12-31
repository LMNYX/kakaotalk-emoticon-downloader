// ==UserScript==
// @name     kakaotalk Emoticon Yoink
// @version  1.0.0
// @author   mishashto
// @grant GM_setClipboard
// @run-at document-end
// @match    https://e.kakao.com/t/*
// @downloadURL https://github.com/LMNYX/kakaotalk-emoticon-downloader/raw/main/kakaoyoink.user.js
// @updateURL https://github.com/LMNYX/kakaotalk-emoticon-downloader/raw/main/kakaoyoink.user.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// ==/UserScript==

const README_FILE = `카카오톡 이모티콘 스틸러에 의해 생성됨
https://github.com/LMNYX 또는 https://reze.moe

이 쓰레기를 사용해 주셔서 감사합니다!

Generated by kakaotalk Emoticon Yoink
https://github.com/LMNYX or https://reze.moe

Thanks for using this shit!`;
var IS_EMOTICON_PAGE = false;

const handleMutations = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (document.querySelector(".info_product") !== null) {
            if(!IS_EMOTICON_PAGE)
            {
                IS_EMOTICON_PAGE = true;
                addButton();
            }
        }
        else {
            IS_EMOTICON_PAGE = false;
        }
      }
    }
  };
  

(async ()=>
 {
    const targetNode = document.getElementById('kakaoWrap');
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver(handleMutations);
    observer.observe(targetNode, config);
}
)().catch(console.error);

function addButton()
{
    let btnHolder = document.querySelector(".wrap_btn");

    let newBtn = document.createElement("button");
    newBtn.classList.add("btn_g");
    newBtn.classList.add("btn_emoticon");
    newBtn.style = "margin-top: 4px";
    newBtn.type = "button";
    newBtn.innerText = navigator.language == "ko-KR" ? "다운로드" : "Yoink";
    newBtn.addEventListener("click", yoinkEmoticon);

    btnHolder.appendChild(newBtn);
}

async function yoinkEmoticon()
{
    let emoticonSetName = document.querySelector(".tit_inner").innerText;

    let zip = new JSZip();

    zip.file("README.txt", README_FILE);

    let emoticons = Array.from(document.querySelectorAll("img.img_emoticon")).map(x => x.src);
    let emoticonCount = emoticons.length;

    for(var i = 0; i < emoticons.length; i++)
    {
        let imgData = await fetch(emoticons[i]);
        let contentType = imgData.headers.get('Content-Type');
        const ctype = contentType.includes('image/gif') ? "gif" : "png";

        let content = await imgData.arrayBuffer();

        await zip.file(`emoticon_${i}.${ctype}`, content, { type: "base64" })
    }

    // thumb
    let imgData = await fetch(document.querySelector(".thumb_img").src);
    let contentType = imgData.headers.get('Content-Type');
    const ctype = contentType.includes('image/gif') ? "gif" : "png";
    let content = await imgData.arrayBuffer();

    await zip.file(`thumb.${ctype}`, content, { type: "base64" });


    let archive = await zip.generateAsync({type:"base64"});
    var link = document.createElement('a');
    link.href="data:application/zip;base64,"+archive;
    link.download = `${emoticonSetName}.zip`;
    link.style = "display: none";
    document.body.appendChild(link);
    link.click();
}

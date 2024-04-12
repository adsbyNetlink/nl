function NetlinkAdxRewarded(adunit) {
  checkGPTExists();

  window.googletag = window.googletag || { cmd: [] }; 
  let rewardedSlot; 
  let rewardPayload;
  googletag.cmd.push(() => { 
    rewardedSlot = googletag.defineOutOfPageSlot(adunit, googletag.enums.OutOfPageFormat.REWARDED); 
    if (rewardedSlot) { 
      rewardedSlot.addService(googletag.pubads()); 
      googletag.pubads().addEventListener('rewardedSlotReady', (event) => { 
        // console.log('Rewarded ad slot is ready.');
        event.makeRewardedVisible(); 
      }); 
      googletag.pubads().addEventListener('rewardedSlotClosed', (event) => {
        // console.log('Closed by the user!');

        if (rewardPayload) { 
          rewardPayload = null; 
        } 
        if (rewardedSlot) { 
          googletag.destroySlots([rewardedSlot]); 
        }
        window.netlink_rewarded_done = true;

      }); 
      googletag.pubads().addEventListener('rewardedSlotGranted', (event) => { 
        rewardPayload = event.payload; 
        // console.log('Reward granted.');
      }); 
      googletag.pubads().addEventListener('slotRenderEnded', (event) => { 
        if (event.slot === rewardedSlot && event.isEmpty) { 
          // console.log('No ad returned for rewarded ad slot.');
          window.netlink_rewarded_done = true;
        } 
      }); 
      googletag.enableServices(); 
      googletag.display(rewardedSlot); 
    } else { 
      // console.log('Rewarded ads are not supported on this page.');
      window.netlink_rewarded_done = true;
    } 
  }); 
}

function NetlinkAdxFirstView(adUnit) {
  if (window.innerWidth >= 768) return;

  checkGPTExists();

  const gpt_id = randomID();

  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    googletag.defineSlot(adUnit, [300, 600], gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  const html = `<div id="netlink-firstview" style="display: block; position: fixed; width: 100%; height: 100vh; min-height: 600px; top: 0px; left: 0px; text-align: center; opacity: 1; background-color: rgba(255, 255, 255, 0.7); visibility: hidden; z-index: 2147483647;">
      <div id="fv-close" style="display: none; position: absolute; width: 60px !important; height: 25px !important; top: 5% !important; right: 0px !important; cursor: pointer; background: rgba(183, 183, 183, 0.71); padding: 2px; border-radius: 20px 0px 0px 20px;" z-index: 99;>
        <span style="position: absolute; font-size: 15px; top: 50%; left: 50%; transform: translate(-50%, -50%);">close</span>
      </div>
      <div id="${gpt_id}" style="position: absolute; min-width: 300px; min-height: 600px; top: 50%; transform: translate(-50%, -50%); left: 0px;"></div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);

  googletag.cmd.push(function() {
    googletag.display(gpt_id);
  });

  document.getElementById('fv-close').addEventListener("click", function () {
    document.getElementById('netlink-firstview').remove();
  });

  let timer = 0
  const interval = setInterval(() => {
    let ads = document.getElementById(gpt_id).querySelector("iframe");
    if (ads && ads.getAttribute("data-load-complete") == "true") {
      clearInterval(interval);

      document.getElementById('netlink-firstview').style.visibility = "visible";
      document.getElementById('fv-close').style.display = "block";
    }

    if(++timer > 15) {
      clearInterval(interval);
    }
  }, 1000);
}

function NetlinkAdxSticky(adUnit, position=0) {
  checkGPTExists();

  window.googletag = window.googletag || { cmd: [] };
  let anchorSlot;
  googletag.cmd.push(() => {
    anchorSlot = googletag.defineOutOfPageSlot(adUnit, document.body.clientWidth <= 768 ? (position != 0 ? googletag.enums.OutOfPageFormat.TOP_ANCHOR : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR) : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR);
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });
  
  googletag.cmd.push(() => {
    googletag.display(anchorSlot);
  });
};

function NetlinkAdxInPage(adUnit, _element, mtop = -1) {
  if (window.innerWidth >= 768) return;

  const ad_width = 300;
  const ad_height = 600;
  const gpt_id = randomID();

  checkGPTExists();

  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    googletag.defineSlot(adUnit, [ad_width, ad_height], gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  const midpoint = Math.min(Math.floor(document.querySelectorAll(_element).length / 2), 4);
  document.querySelectorAll(_element)[midpoint - 1].insertAdjacentHTML("afterend", "<div id='netlink-inpage-ad'></div>");

  const html = `<div id="inpage-content-ad" style="overflow: hidden; position: relative; z-index: 2; width: 100%;">
    <div id="inpage-ad" style="display:none;">
      <div id='${gpt_id}' style='min-width: ${ad_width}px; min-height: ${ad_height}px;'></div>
    </div>
  </div>`;
  document.getElementById("netlink-inpage-ad").insertAdjacentHTML("beforeend", html);

  googletag.cmd.push(() => {
    googletag.display(gpt_id);
  });

  window.addEventListener("scroll", function () {
    const inpageContentAds = document.getElementById("inpage-content-ad");
    if (!inpageContentAds) return;

    mtop >= 0 ? mtop : (window.innerHeight - ad_height) / 2;
    const top = inpageContentAds.getBoundingClientRect().top - mtop;
    const bot = top > 0 ? ad_height : ad_height + top;

    if (window.innerWidth < 768) {
      inpageContentAds.style.height = ad_height+"px";
      document.getElementById("inpage-ad").style.cssText = `
        display: block;
        clip: rect(${top}px, ${ad_width}px, ${bot}px, 0px);
        left: ${(window.innerWidth - ad_width) / 2}px;
        top: ${mtop}px;
        position: fixed;
        z-index: 10000;
      `;
    }
  });
};

function NetlinkAdxInImage(adUnit, _element, _intImage = 1) {
  if (window.innerWidth >= 768) return;

  const images = document.body.querySelectorAll(_element + " img");
  const image = images[_intImage - 1];
  if(image == undefined) return;

  checkGPTExists();

  const gpt_id = randomID();
  const size = [ [300, 50], [300, 100], ];

  var containerPar = document.createElement("div");
  containerPar.style.position = "relative";
  containerPar.style.display = "inline-block";
  containerPar.style.width = image.width + "px !important";
  containerPar.style.height = image.height + "px !important";

  var containerNL = document.createElement("div");
  containerNL.id = "containerNL";
  containerNL.style.position = "absolute";
  containerNL.style.bottom = 0;
  containerNL.style.zIndex = 8;
  containerNL.style.setProperty("width", image.width + "px", "important");
  containerNL.style.setProperty("max-height", "100px", "important");

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function () {
    googletag.defineSlot(adUnit, size, gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var divElementAds = document.createElement("center");

  var divElement = document.createElement("div");
  divElement.id = gpt_id;
  divElement.style.setProperty("width", "300px", "important");
  divElementAds.appendChild(divElement);

  var btnCloseNL = document.createElement("span");
  btnCloseNL.innerHTML = "×";
  btnCloseNL.style.position = "absolute";
  btnCloseNL.style.display = "none";
  btnCloseNL.style.zIndex = 1;
  btnCloseNL.style.setProperty("width", "25px", "important");
  btnCloseNL.style.setProperty("height", "25px", "important");
  btnCloseNL.style.setProperty("right", "2px", "important");
  btnCloseNL.style.setProperty("top", "-27px", "important");
  btnCloseNL.style.cursor = "pointer";
  btnCloseNL.style.fontSize = "20px";
  btnCloseNL.style.textAlign = "center";
  btnCloseNL.style.background = "white";
  btnCloseNL.style.padding = "2px";
  btnCloseNL.style.borderRadius = "20px";

  containerNL.appendChild(divElementAds);
  containerNL.appendChild(btnCloseNL);

  var intervalImg = setInterval(function () {
    if (isImageFile(image.src)) {
      containerPar.appendChild(image.cloneNode(true));
      containerPar.appendChild(containerNL);
      image.parentNode.replaceChild(containerPar, image);
      clearInterval(intervalImg);

      googletag.cmd.push(function () {
        googletag.display(gpt_id);
      });

      var adCheck = setIntervalWithTimeout(
        function () {
          var iframeAdx = divElement.querySelector("iframe");
          if (iframeAdx) {
            if (iframeAdx.getAttribute("data-load-complete") == "true") {
              containerNL.style.backgroundColor = "white";
              btnCloseNL.style.display = "block";
              clearInterval(adCheck.intervalId);
            }
          }
        },
        1000,
        10000
      );
    }
  }, 1000);

  btnCloseNL.addEventListener("click", function () {
    document.getElementById("containerNL").remove();
  });
};

function NetlinkAdxMultipleSize(adUnit, _element, mtop=0) {
  if (window.innerWidth >= 768) return;

  checkGPTExists();

  var netlink_style = document.createElement("style");
  netlink_style.type = "text/css";
  netlink_style.innerHTML =
    ".netlink-multiplesize { margin-top:10px;margin-bottom:10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw); }" +
    '.netlink-multiplesize::before { content: "Ads By Netlink";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }' +
    '.netlink-multiplesize::after { content: "Scroll to Continue";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }';
  document.head.appendChild(netlink_style);
  
  const size = [ [300, 250], [300, 600], ];
  const gpt_id = randomID();
  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function () {
    googletag.defineSlot(adUnit, size, gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var links = document.body.querySelector(_element);

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
  }
  var el = document.createElement("div");
  el.setAttribute("class", "netlink-multiplesize");
  insertAfter(links, el);

  var html = `<div class="ms-content-ad" style="position: relative;min-height: 600px;">
      <div class="ms-ad" style="text-align: center;">
        <div id="${gpt_id}"></div>
      </div>
    </div>`;

  el.innerHTML = html;

  googletag.cmd.push(function () {
    googletag.display(gpt_id);
  });
  
  document.addEventListener("scroll", function (e) {
    const elements = document.getElementsByClassName("netlink-multiplesize");
    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];

      var div = e.querySelector(".ms-ad");
      var h = e.querySelector(".ms-content-ad").clientHeight;
      var ch = e.querySelector(".ms-ad").clientHeight;

      var ap = e.querySelector(".ms-content-ad").getBoundingClientRect().top;
      if (ch < h) {
        if (ap >= mtop) {
          div.style.position = "";
          div.style.top = "";
          div.style.bottom = "";
          div.style.left = "";
          div.style.transform = "";
        } else if (ap < mtop && Math.abs(ap) + ch < h - mtop) {
          div.style.position = "fixed";
          div.style.top = mtop + "px";
          div.style.bottom = "";
          div.style.left = "50%";
          div.style.transform = "translateX(-50%)";
        } else if (Math.abs(ap) + ch >= h - mtop) {
          div.style.position = "absolute";
          div.style.top = "";
          div.style.bottom = "0";
          div.style.left = "50%";
          div.style.transform = "translateX(-50%)";
        }
      } else {
        div.style.position = "";
        div.style.top = "";
        div.style.bottom = "";
        div.style.left = "";
        div.style.transform = "";
      }
    }
  });
};


function calculateScrollToViewRatio() {
  const windowHeight = window.innerHeight; // Chiều cao của cửa sổ trình duyệt
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  ); // Chiều cao của tài liệu web

  const scrollRatio = Math.ceil(documentHeight / windowHeight); // Tính toán tỷ lệ scroll

  return scrollRatio;
}

var MultiRatioAdxNetlink = function (adUnit, _divElement, _intTop) {
  checkGPTExists();

  const scrollRatio = calculateScrollToViewRatio();
  console.log("Scroll to view ratio:", scrollRatio);

  var netlink_style = document.createElement("style");
  netlink_style.type = "text/css";
  netlink_style.innerHTML =
    ".netlink-multiplesize { margin-top:10px;margin-bottom:10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw); }" +
    ".ms-content-ad { position: relative;min-height: 600px; }" +
    ".ms-ad { text-align: center; }" +
    '.netlink-multiplesize::before { content: "Ads By Netlink";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }' +
    '.netlink-multiplesize::after { content: "Scroll to Continue";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }';
  document.head.appendChild(netlink_style);

  document.addEventListener("DOMContentLoaded", () => {
    if (window.screen.width <= 768) {
      var ads_config = [];
      for (var i = 0; i < scrollRatio / 2; i++) {
        addAds(adUnit);
      }
      function addAds(_adU) {
        const size = [ [300, 600], [300, 250], ];
        const id = randomID(); // ID ngẫu nhiên cho ads unit
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(function () {
          googletag.defineSlot(_adU, size, id).addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
        });
        ads_config.push({
          ad_unit: _adU,
          size: size,
          id: id,
        });
      }

      var ac = 0;
      var sp = (ap = 0);

      var links = document.querySelectorAll(_divElement);
      for (var i = 0; i < links.length; i++) {
        if (ac == ads_config.length) break;

        if (sp == 0) {
          sp = links[i].offsetTop;
        }

        ap = links[i].offsetTop;
        // if (sp + screen.height < ap) {
        if (screen.height < ap) {
          function insertAfter(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
          }

          var c = ads_config[ac];

          var el = document.createElement("div");
          el.setAttribute("class", "netlink-multiplesize");
          insertAfter(links[i], el);

          var html =
            '<div class="ms-content-ad">' +
            '<div class="ms-ad">' +
            '<div id="' +
            c.id +
            '"></div>' +
            "</div>" +
            "</div>";

          el.innerHTML = html;

          googletag.cmd.push(function () {
            googletag.display(c.id);
          });

          ac++;
          sp = ap + el.clientHeight;
        }
      }

      if (document.getElementsByClassName("netlink-multiplesize").length > 0) {
        in_articles();
      }
    }
  });

  function in_articles() {
    document.addEventListener("scroll", function (e) {
      var s = document.documentElement.scrollTop;

      for (
        var i = 0;
        i < document.getElementsByClassName("netlink-multiplesize").length;
        i++
      ) {
        var e = document.getElementsByClassName("netlink-multiplesize")[i];

        var div = e.querySelector(".ms-ad");
        var h = e.querySelector(".ms-content-ad").clientHeight;
        var ch = e.querySelector(".ms-ad").clientHeight;

        var ap = e.querySelector(".ms-content-ad").getBoundingClientRect().top;
        if (ch < h) {
          if (ap >= 0) {
            div.style.position = "";
            div.style.top = "";
            div.style.bottom = "";
            div.style.left = "";
            div.style.transform = "";
          } else if (ap < 0 && Math.abs(ap) + ch < h) {
            div.style.position = "fixed";
            div.style.top = _intTop != null ? _intTop + "px" : "0";
            div.style.bottom = "";
            div.style.left = "50%";
            div.style.transform = "translateX(-50%)";
          } else if (Math.abs(ap) + ch >= h - _intTop) {
            div.style.position = "absolute";
            div.style.top = "";
            div.style.bottom = "0";
            div.style.left = "50%";
            div.style.transform = "translateX(-50%)";
          }
        } else {
          div.style.position = "";
          div.style.top = "";
          div.style.bottom = "";
          div.style.left = "";
          div.style.transform = "";
        }
      }
    });
  }
};


function setIntervalWithTimeout(callback, interval, timeout) {
  var timer = setInterval(function () {
    callback();
  }, interval);
  var timeoutId = setTimeout(function () {
    clearInterval(timer);
  }, timeout);
  return { intervalId: timer, timeoutId: timeoutId };
}

//===========================================================================
//adsense

const adSense_client =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3166493188367342";

//firstview_adSemse
var FirstViewAdSenseNetlink = function (_adSlot) {
  var body = window.document.querySelector("body");
  var _head = window.document.querySelector("head");
  // Tạo phần tử div chứa hình ảnh
  var mobileFVAdxElement = document.createElement("div");
  mobileFVAdxElement.style.setProperty("width", "100%", "important");
  mobileFVAdxElement.style.setProperty("position", "fixed", "important");
  mobileFVAdxElement.style.setProperty("top", "0", "important");
  mobileFVAdxElement.style.setProperty("left", "0", "important");
  mobileFVAdxElement.style.zIndex = "10000000000";
  mobileFVAdxElement.style.textAlign = "center";
  mobileFVAdxElement.style.opacity = 1;
  mobileFVAdxElement.style.height = "100vh";
  mobileFVAdxElement.style.setProperty("min-height", "300px", "important");
  mobileFVAdxElement.style.backgroundColor = "#ffffffb3";
  mobileFVAdxElement.style.visibility = "hidden";

  var scriptTag = document.createElement("script");
  scriptTag.src = adSense_client;
  scriptTag.async = true;
  scriptTag.crossOrigin = "anonymous";
  _head.appendChild(scriptTag);

  var scriptTag2 = document.createElement("script");
  scriptTag2.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`;

  var divElement = document.createElement("ins");
  divElement.className = "adsbygoogle";
  divElement.style.display = "inline-block";
  divElement.style.width = "300px";
  divElement.style.height = "600px";
  divElement.setAttribute("data-ad-client", "ca-pub-3166493188367342");
  divElement.setAttribute("data-ad-slot", _adSlot);
  divElement.style.position = "absolute";
  divElement.style.left = "50%";
  divElement.style.top = "50%";
  divElement.style.transform = "translate(-50%, -50%)";

  // Tạo nút xóa

  var btnCloseNLFVAdx = document.createElement("div");
  btnCloseNLFVAdx.style.position = "absolute";
  btnCloseNLFVAdx.style.setProperty("display", "none", "important");
  btnCloseNLFVAdx.style.zIndex = 99;
  btnCloseNLFVAdx.style.setProperty("width", "60px", "important");
  btnCloseNLFVAdx.style.setProperty("height", "25px", "important");
  btnCloseNLFVAdx.style.setProperty("right", "0px", "important");
  btnCloseNLFVAdx.style.setProperty("top", "5%", "important");
  btnCloseNLFVAdx.style.cursor = "pointer";

  btnCloseNLFVAdx.style.background = "#b7b7b7b5";
  btnCloseNLFVAdx.style.padding = "2px";
  btnCloseNLFVAdx.style.borderRadius = "20px 0px 0px 20px";

  var spanCloseNLFVAdx = document.createElement("span");
  spanCloseNLFVAdx.innerHTML = "close";
  spanCloseNLFVAdx.style.position = "absolute";
  spanCloseNLFVAdx.style.fontSize = "15px";
  spanCloseNLFVAdx.style.top = "50%";
  spanCloseNLFVAdx.style.left = "50%";
  spanCloseNLFVAdx.style.transform = "translate(-50%, -50%)";

  btnCloseNLFVAdx.appendChild(spanCloseNLFVAdx);

  mobileFVAdxElement.appendChild(btnCloseNLFVAdx);
  mobileFVAdxElement.appendChild(divElement);
  mobileFVAdxElement.appendChild(scriptTag2);

  body.appendChild(mobileFVAdxElement);
  if (window.innerWidth <= 768) {
    mobileFVAdxElement.style.setProperty("display", "block", "important");
  } else {
    mobileFVAdxElement.style.setProperty("display", "none", "important");
  }

  window.addEventListener("scroll", function () {
    mobileFVAdxElement.style.height = "100vh";
  });
  btnCloseNLFVAdx.addEventListener("click", function () {
    mobileFVAdxElement.remove();
  });

  var adCheck = setIntervalWithTimeout(
    function () {
      if (divElement.getAttribute("data-ad-status") == "filled") {
        var iframeAdx = divElement.querySelector("iframe");
        if (iframeAdx) {
          if (iframeAdx.getAttribute("data-load-complete") == "true") {
            // containerNL.style.backgroundColor = "white";
            mobileFVAdxElement.style.visibility = "visible";
            btnCloseNLFVAdx.style.display = "block";
            clearInterval(adCheck.intervalId);
          }
        }
      }
    },
    1000,
    10000
  );
  function setIntervalWithTimeout(callback, interval, timeout) {
    var timer = setInterval(function () {
      callback();
    }, interval);
    var timeoutId = setTimeout(function () {
      clearInterval(timer);
    }, timeout);
    return { intervalId: timer, timeoutId: timeoutId };
  }
};

//inpage_adsense
var InPageAdSenseNetlink = function (_adSlot, _divElement, _divChilElement) {
  var _head = window.document.querySelector("head");
  $(document).ready(function () {
    $(document).ready(function () {
      $(window).on("scroll", function () {
        if (document.getElementById("content-ad") != null) {
          var top = $("#content-ad").offset().top - $(window).scrollTop() - 70;
          var bot = top > 0 ? 600 : 600 + top;
          if ($(window).width() < 768) {
            document
              .getElementById("content-ad")
              .style.setProperty("min-height", "600px", "important");
            $("#ad").css({
              display: `block`,
              clip: `rect(` + top + `px, 300px, ` + bot + `px, 0px)`,
              left: ($(window).width() - 300) / 2 + `px`,
            });
          }
        }
      });
    });

    var count = 0;
    var links = $(_divElement).find(_divChilElement);
    if (links.length <= 4) midpoint = 1;
    else midpoint = Math.floor(links.length / 2);
    for (var i = 0; i < links.length; i++) {
      console.log(midpoint);
      count++;
      if (count == midpoint) {
        var ele = links[i];
        function insertAfter(referenceNode, newNode) {
          referenceNode.parentNode.insertBefore(
            newNode,
            referenceNode.nextSibling
          );
        }
        var el = document.createElement("div");
        el.setAttribute("id", "netlink");
        var div = links[i];
        insertAfter(div, el);
      }
    }
    var scriptTag = document.createElement("script");
    scriptTag.src = adSense_client;
    scriptTag.async = true;
    scriptTag.crossOrigin = "anonymous";
    _head.appendChild(scriptTag);
    var html = `<div id="content-ad" style="overflow: hidden; position: relative; z-index: 2; width: 100%; height: auto">`;
    html += `<div id="ad" style="position: fixed;z-index: 10000;top: 70px;display:none;">`;
    html += `<ins class="adsbygoogle"
    style="display:inline-block;min-width:300px;min-height:600px;"
    data-ad-client="ca-pub-3166493188367342"
    data-ad-slot="${_adSlot}"></ins>
    <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
    </script>`;
    html += `</div>`;
    html += `</div>`;
    $("#netlink").append(html);
  });
};


///
function checkGPTExists() {
  const scripts = document.querySelectorAll("head script");
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src === "https://securepubads.g.doubleclick.net/tag/js/gpt.js") {
      return true;
    }
  }

  const gpt_script = document.createElement("script");
  gpt_script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  gpt_script.async = true;
  document.head.appendChild(gpt_script);

  return false;
}

let ar = [];
function randomID() {
  let r = Math.random().toString().substring(2);
  while (1) {
    if (!ar.includes(r)) {
      break;
    }
    r = Math.random().toString().substring(2);
  }
  ar.push(r);

  return "netlink-gpt-ad-" + r + "-0";
}

function isImageFile(str) {
  return /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(str);
}

//firstview_adx
var FirstViewAdxNetlink = function (adUnit) {
  var body = window.top.document.querySelector("body");
  var _head = window.top.document.querySelector("head");
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
  scriptTag.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  scriptTag.async = true;

  var scriptTag2 = document.createElement("script");
  scriptTag2.innerHTML = `window.googletag = window.googletag || {cmd: []};googletag.cmd.push(function() {googletag.defineSlot("${adUnit}", [300, 600], 'div-gpt-ad-1711681469270-0').addService(googletag.pubads());googletag.pubads().enableSingleRequest();googletag.enableServices();});`;

  _head.appendChild(scriptTag);
  _head.appendChild(scriptTag2);

  var divElement = document.createElement("div");
  divElement.id = "div-gpt-ad-1711681469270-0";
  //divElement.style.setProperty("minHeight", "600px", "important");
  //divElement.style.setProperty("width", "300px", "important");
  divElement.style.minWidth = "300px";
  divElement.style.minHeight = "600px";
  divElement.style.position = "absolute";
  divElement.style.left = "50%";
  divElement.style.top = "50%";
  divElement.style.transform = "translate(-50%, -50%)";

  var scriptElement2 = document.createElement("script");
  scriptElement2.innerHTML =
    "googletag.cmd.push(function() {googletag.display('div-gpt-ad-1711681469270-0');});";
  divElement.appendChild(scriptElement2);

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
  mobileFVAdxElement.appendChild(scriptElement2);

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
      var iframeAdx = divElement.querySelector("iframe");
      if (iframeAdx) {
        if (iframeAdx.getAttribute("data-load-complete") == "true") {
          // containerNL.style.backgroundColor = "white";
          mobileFVAdxElement.style.visibility = "visible";
          btnCloseNLFVAdx.style.display = "block";
          clearInterval(adCheck.intervalId);
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

//reward_adx
var RewardAdxNetlink = function (adunit) {
  var _body = window.top.document.querySelector("body");
  var _head = window.top.document.querySelector("head");
  var scriptTag = document.createElement("script");
  scriptTag.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  scriptTag.async = true;

  _head.appendChild(scriptTag);
  var scriptElement = document.createElement("script");
  scriptElement.innerHTML = `window.googletag = window.googletag || { cmd: [] }; let rewardedSlot; let rewardPayload;googletag.cmd.push(() => { rewardedSlot = googletag.defineOutOfPageSlot('${adunit}', googletag.enums.OutOfPageFormat.REWARDED); if (rewardedSlot) { rewardedSlot.addService(googletag.pubads()); googletag.pubads().addEventListener('rewardedSlotReady', (event) => { console.log('Rewarded ad slot is ready.'); event.makeRewardedVisible(); }); googletag.pubads().addEventListener('rewardedSlotClosed', dismissRewardedAd); googletag.pubads().addEventListener('rewardedSlotGranted', (event) => { rewardPayload = event.payload; console.log('Reward granted.'); }); googletag.pubads().addEventListener('slotRenderEnded', (event) => { if (event.slot === rewardedSlot && event.isEmpty) { console.log('No ad returned for rewarded ad slot.'); } }); googletag.enableServices(); googletag.display(rewardedSlot); } else { console.log('Rewarded ads are not supported on this page.'); } }); function dismissRewardedAd() { if (rewardPayload) { rewardPayload = null; } if (rewardedSlot) { googletag.destroySlots([rewardedSlot]); } }`;
  _body.appendChild(scriptElement);
};

//inpage_adx
var InPageAdxNetlink = function (adUnit, _divElement, _divChilElement) {
  var _head = window.top.document.querySelector("head");
  $(document).ready(function () {
    $(document).ready(function () {
      $(window).on("scroll", function () {
        if (document.getElementById("content-ad") != null) {
          var top = $("#content-ad").offset().top - $(window).scrollTop() - 70;
          var bot = top > 0 ? 600 : 600 + top;
          if ($(window).width() < 768) {
            document
              .getElementById("content-ad")
              .style.setProperty("height", "600px", "important");
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
    console.log(links);
    if (links.length <= 4) midpoint = 1;
    else midpoint = Math.floor(links.length / 2);
    for (var i = 0; i < links.length; i++) {
      console.log(midpoint);
      count++;
      console.log(midpoint);
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
    scriptTag.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    scriptTag.async = true;

    var scriptTag2 = document.createElement("script");
    scriptTag2.innerHTML = `window.googletag = window.googletag || {cmd: []};googletag.cmd.push(function() {googletag.defineSlot("${adUnit}", [300, 600], 'div-gpt-ad-1712027483252-0').addService(googletag.pubads());googletag.pubads().enableSingleRequest();googletag.enableServices();});`;
    _head.appendChild(scriptTag);
    _head.appendChild(scriptTag2);
    var html = `<div id="content-ad" style="overflow: hidden; position: relative; z-index: 2; width: 100%;">`;
    html += `<div id="ad" style="position: fixed;z-index: 10000;top: 70px;display:none;">`;
    html += `<div id='div-gpt-ad-1712027483252-0' style='min-width: 300px; min-height: 600px;'>
      <script>
        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1712027483252-0'); });
      </script>
      </div>`;
    html += `</div>`;
    html += `</div>`;
    $("#netlink").append(html);
  });
};

//sticky_adx
var StickyAdxNetlink = function (adUnit, _isMbtop) {
  var _body = window.top.document.querySelector("body");
  var _head = window.top.document.querySelector("head");
  var scriptTag = document.createElement("script");
  scriptTag.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  scriptTag.async = true;

  _head.appendChild(scriptTag);
  var scriptTagElement = document.createElement("script");
  scriptTagElement.innerHTML = ` window.googletag = window.googletag || { cmd: [] };
    let anchorSlot;
    googletag.cmd.push(() => {
      anchorSlot = googletag.defineOutOfPageSlot(
        "${adUnit}",
        document.body.clientWidth <= 768
          ? (${_isMbtop} ? googletag.enums.OutOfPageFormat.TOP_ANCHOR : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR)
          : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
      );
      if (anchorSlot) {
        anchorSlot.setTargeting("test", "anchor").addService(googletag.pubads());
      }
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
  
    googletag.cmd.push(() => {
      googletag.display(anchorSlot);
    });`;
  _body.appendChild(scriptTagElement);
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

// Sử dụng hàm để lấy kết quả

//Multi_adx
var MultiRatioAdxNetlink = function (adUnit, _divElement, _intTop) {
  const scrollRatio = calculateScrollToViewRatio();
  console.log("Scroll to view ratio:", scrollRatio);
  var gpt_script = document.createElement("script");
  gpt_script.async = true;
  gpt_script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.getElementsByTagName("head")[0].appendChild(gpt_script);

  var netlink_style = document.createElement("style");
  netlink_style.type = "text/css";
  netlink_style.innerHTML =
    ".netlink-in-articles { margin-top:10px;margin-bottom:10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw); }" +
    ".ia-content { position: relative;min-height: 600px; }" +
    ".in-articles { text-align: center; }" +
    '.netlink-in-articles::before { content: "Ads By Netlink";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }' +
    '.netlink-in-articles::after { content: "Scroll to Continue";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }';
  document.getElementsByTagName("head")[0].appendChild(netlink_style);

  document.addEventListener("DOMContentLoaded", () => {
    if (window.screen.width <= 768) {
      var ads_config = [];
      for (var i = 0; i < scrollRatio / 2; i++) {
        addAds(adUnit);
      }
      function addAds(_adU) {
        const size = [
          [300, 600],
          [300, 250],
        ]; // Kích thước quảng cáo
        const id = random_id(); // ID ngẫu nhiên cho ads unit
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
          el.setAttribute("class", "netlink-in-articles");
          insertAfter(links[i], el);

          var html =
            '<div class="ia-content">' +
            '<div class="in-articles">' +
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

      if (document.getElementsByClassName("netlink-in-articles").length > 0) {
        in_articles();
      }
    }
  });

  function in_articles() {
    document.addEventListener("scroll", function (e) {
      var s = document.documentElement.scrollTop;

      for (
        var i = 0;
        i < document.getElementsByClassName("netlink-in-articles").length;
        i++
      ) {
        var e = document.getElementsByClassName("netlink-in-articles")[i];

        var div = e.querySelector(".in-articles");
        var h = e.querySelector(".ia-content").clientHeight;
        var ch = e.querySelector(".in-articles").clientHeight;

        var ap = e.querySelector(".ia-content").getBoundingClientRect().top;
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
          } else if (Math.abs(ap) + ch >= h) {
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

  var ar = [];
  function random_id() {
    var r = Math.random().toString().substring(2);
    while (1) {
      if (!ar.includes(r)) {
        break;
      }
      r = Math.random().toString().substring(2);
    }
    ar.push(r);

    return "div-netlink-ia-" + r + "-0";
  }
};
var MultiFixedAdxNetlink = function (adUnit, _divElement, _intTop) {
  var gpt_script = document.createElement("script");
  gpt_script.async = true;
  gpt_script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.getElementsByTagName("head")[0].appendChild(gpt_script);

  var netlink_style = document.createElement("style");
  netlink_style.type = "text/css";
  netlink_style.innerHTML =
    ".netlink-in-articles { margin-top:10px;margin-bottom:10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw); }" +
    ".ia-content { position: relative;min-height: 600px; }" +
    ".in-articles { text-align: center; }" +
    '.netlink-in-articles::before { content: "Ads By Netlink";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }' +
    '.netlink-in-articles::after { content: "Scroll to Continue";display: inline-block;width: 100%;height: 20px;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1; }';
  document.getElementsByTagName("head")[0].appendChild(netlink_style);

  document.addEventListener("DOMContentLoaded", () => {
    if (window.screen.width <= 768) {
      const size = [
        [300, 600],
        [300, 250],
      ]; // Kích thước quảng cáo
      const id = random_id(); // ID ngẫu nhiên cho ads unit
      window.googletag = window.googletag || { cmd: [] };
      googletag.cmd.push(function () {
        googletag.defineSlot(adUnit, size, id).addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
      });
      var links = document.getElementById(_divElement);
      // console.log(links);

      function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
      }
      var el = document.createElement("div");
      el.setAttribute("class", "netlink-in-articles");
      insertAfter(links, el);

      var html =
        '<div class="ia-content">' +
        '<div class="in-articles">' +
        '<div id="' +
        id +
        '"></div>' +
        "</div>" +
        "</div>";

      el.innerHTML = html;
      googletag.cmd.push(function () {
        googletag.display(id);
      });
      in_articles();
    }

    if (document.getElementsByClassName("netlink-in-articles").length > 0) {
    }
  });

  function in_articles() {
    document.addEventListener("scroll", function (e) {
      var s = document.documentElement.scrollTop;
      for (
        var i = 0;
        i < document.getElementsByClassName("netlink-in-articles").length;
        i++
      ) {
        var e = document.getElementsByClassName("netlink-in-articles")[i];

        var div = e.querySelector(".in-articles");
        var h = e.querySelector(".ia-content").clientHeight;
        var ch = e.querySelector(".in-articles").clientHeight;

        var ap = e.querySelector(".ia-content").getBoundingClientRect().top;
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
          } else if (Math.abs(ap) + ch >= h) {
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

  var ar = [];
  function random_id() {
    var r = Math.random().toString().substring(2);
    while (1) {
      if (!ar.includes(r)) {
        break;
      }
      r = Math.random().toString().substring(2);
    }
    ar.push(r);

    return "div-netlink-ia-" + r + "-0";
  }
};

//in_image_adx
var InImageAdsNetlink = function (adUnit, _intImage) {
  var _head = window.top.document.querySelector("head");
  var _body = window.top.document.querySelector("body");
  var mainContentDetail = _body.querySelectorAll("img");
  console.log(_body.querySelectorAll("img"));
  images = _body.querySelectorAll("img");
  var intImage = _intImage - 1;

  var containerPar = document.createElement("div");
  containerPar.style.position = "relative";
  containerPar.style.display = "inline-block";
  containerPar.style.width = images[intImage].width + "px !important";
  containerPar.style.height = images[intImage].height + "px !important";

  var containerNL = document.createElement("div");
  containerNL.id = "containerNL";
  containerNL.style.position = "absolute";
  containerNL.style.bottom = 0;
  containerNL.style.zIndex = 8;
  containerNL.style.setProperty(
    "width",
    images[intImage].width + "px",
    "important"
  );
  // containerNL.style.setProperty("height", "50px", "important");

  var scriptTag = document.createElement("script");
  scriptTag.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  scriptTag.async = true;

  var scriptTag2 = document.createElement("script");
  scriptTag2.innerHTML = `window.googletag = window.googletag || {cmd: []};googletag.cmd.push(function() {googletag.defineSlot('${adUnit}', [[300, 50], [300, 100]], 'div-gpt-ad-1711076508079-0').addService(googletag.pubads());googletag.pubads().enableSingleRequest();googletag.enableServices();});`;

  _head.appendChild(scriptTag);
  _head.appendChild(scriptTag2);
  var divElementAds = document.createElement("div");

  var divElement = document.createElement("div");
  divElement.id = "div-gpt-ad-1711076508079-0";
  divElement.style.setProperty("width", "300px", "important");

  divElementAds.appendChild(divElement);
  var scriptElement2 = document.createElement("script");
  scriptElement2.innerHTML =
    "googletag.cmd.push(function() {googletag.display('div-gpt-ad-1711076508079-0');});";
  divElement.appendChild(scriptElement2);

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
    if (isImageFile(images[intImage].src)) {
      containerPar.appendChild(images[intImage].cloneNode(true));
      containerPar.appendChild(containerNL);
      images[intImage].parentNode.replaceChild(containerPar, images[intImage]);
      clearInterval(intervalImg);

      var adCheck = setIntervalWithTimeout(
        function () {
          var iframeAdx = divElement.querySelector("iframe");
          if (iframeAdx) {
            if (iframeAdx.getAttribute("data-load-complete") == "true") {
              containerNL.style.backgroundColor = "white";
              btnCloseNL.style.display = "block";
              clearInterval(adCheck.intervalId);
            }
          } else {
            console.log("Không tìm thấy thẻ iframe trong div container.");
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

function isImageFile(str) {
  return /\.(jpg|jpeg|png)$/i.test(str);
}

function setIntervalWithTimeout(callback, interval, timeout) {
  var timer = setInterval(function () {
    callback();
  }, interval);
  var timeoutId = setTimeout(function () {
    clearInterval(timer);
  }, timeout);
  return { intervalId: timer, timeoutId: timeoutId };
}

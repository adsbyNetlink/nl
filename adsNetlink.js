//_insertPosition = 0: beforeend, position = 1: afterbegin, position = 2: beforebegin, position = 3: afterend
function NetlinkAdx(_adUnit, _adSize, _mapping = [], _element, _insertPosition=0, _set_min=0) {
  var element = document.body.querySelector(_element);
  if(element == null) return;

  checkGPTExists();

  var gpt_id = randomID();

  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    var adSlot = googletag.defineSlot(_adUnit, _adSize, gpt_id).addService(googletag.pubads());

    if(_mapping.length) {
      var mapping = googletag.sizeMapping();

      _mapping.forEach(({ breakpoint, size }) => {
          var sizeArray = Array.isArray(size) ? size : [size];
          mapping.addSize(breakpoint, sizeArray);
      });
      
      var finalMapping = mapping.build();

      adSlot.defineSizeMapping(finalMapping);
    }

    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var style_min = "";
  if(_set_min != 0) {
    var min_width = 0;
    var min_height = 0;
    if(!Array.isArray(_adSize[0]) && !Array.isArray(_adSize[1])) {
      min_width = _adSize[0];
      min_height = _adSize[1];
    } else {
      for (var i = 0; i < _adSize.length; i++) {
        min_width = _adSize[i][0] < min_width || min_width == 0 ? _adSize[i][0] : min_width
        min_height = _adSize[i][1] < min_height || min_height == 0 ? _adSize[i][1] : min_height
      }
    }
    style_min = "min-width: "+min_width+"px; min-height: "+min_height+"px;";
  }

  var html = `<div class="netlink-banner-ad">
      <center>
        <div id='${gpt_id}' style='${style_min}'></div>
      </center>
    </div>`;

  if(_insertPosition == 1) element.insertAdjacentHTML("afterbegin", html);
  else if(_insertPosition == 2) element.insertAdjacentHTML("beforebegin", html);
  else if(_insertPosition == 3) element.insertAdjacentHTML("afterend", html);
  else element.insertAdjacentHTML("beforeend", html);

  googletag.cmd.push(() => {
    googletag.display(gpt_id);
  });
}

function NetlinkAdxInterstitial(_adUnit) {
  checkGPTExists();

  window.googletag = window.googletag || {cmd: []};
  var interstitialSlot;
  googletag.cmd.push(function() {
    interstitialSlot = googletag.defineOutOfPageSlot(_adUnit, googletag.enums.OutOfPageFormat.INTERSTITIAL);
    if (interstitialSlot) {
      interstitialSlot.addService(googletag.pubads());
    }

    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
    googletag.display(interstitialSlot);
  });
}

//_insertPosition = 0: beforeend, position = 1: afterbegin, position = 2: beforebegin, position = 3: afterend
function NetlinkAdxAutoAds(_adUnit, _start, _end, _adSize, _mapping = [], _elements, _insertPosition=2, _set_min=0, _minScreen = 1) {
  var elements = document.querySelectorAll(_elements);
  if(elements.length == 0) return;

  var lastSpaceIndex = _elements.lastIndexOf(' ');
  var _element_str = lastSpaceIndex === -1 ? _elements : _elements.slice(0, lastSpaceIndex).trim() + ' > ' + _elements.slice(lastSpaceIndex + 1).trim();

  var min_ad = 0;
  for (var i = 0; i < elements.length; i++) {
    if(_start > _end) break;

    var _element = _element_str+':nth-of-type('+(i+1)+')';

    if(_insertPosition == 0 || _insertPosition == 3) {
      if(i == 0 || elements[i].offsetTop + elements[i].clientHeight - min_ad - (screen.height * _minScreen) >= 0) {
        var adUnit = _adUnit + (_start++);
        NetlinkAdx(adUnit, _adSize, _mapping, _element, _insertPosition, _set_min);

        if(i < elements.length - 1)
          min_ad = elements[i+1].offsetTop;
      }
    } else if(_insertPosition == 1 || _insertPosition == 2) {
      if(i == 0 || elements[i].offsetTop - min_ad - (screen.height * _minScreen) >= 0) {
        var adUnit = _adUnit + (_start++);
        NetlinkAdx(adUnit, _adSize, _mapping, _element, _insertPosition, _set_min);
        min_ad = elements[i].offsetTop;

        if(i < elements.length - 1) continue;
      }

      if(i == elements.length - 1 && elements[i].offsetTop + elements[i].clientHeight - min_ad - (screen.height * _minScreen) >= 0) {
        var adUnit = _adUnit + (_start++);
        NetlinkAdx(adUnit, _adSize, _mapping, _element, _insertPosition == 1 ? 0 : 3, _set_min);
      }
    }
  }
}

function NetlinkAdxSticky(_adUnit, _adPosition=0) {
  checkGPTExists();

  window.googletag = window.googletag || { cmd: [] };
  var anchorSlot;
  googletag.cmd.push(() => {
    anchorSlot = googletag.defineOutOfPageSlot(_adUnit, document.body.clientWidth < 768 && _adPosition != 0 ? googletag.enums.OutOfPageFormat.TOP_ANCHOR : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR);
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });
  
  googletag.cmd.push(() => {
    googletag.display(anchorSlot);
  });
}

function NetlinkAdxInImage(_adUnit, _adSize, _mapping = [], _element, _image = 1, _marginBottom=0) {
  var images = document.body.querySelectorAll(_element);
  var image = images[_image - 1];
  if(image == undefined) return;

  checkGPTExists();

  var gpt_id = randomID();

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function () {
    var adSlot = googletag.defineSlot(_adUnit, _adSize, gpt_id).addService(googletag.pubads());

    if(_mapping.length) {
      var mapping = googletag.sizeMapping();

      _mapping.forEach(({ breakpoint, size }) => {
          var sizeArray = Array.isArray(size) ? size : [size];
          mapping.addSize(breakpoint, sizeArray);
      });
      
      var finalMapping = mapping.build();

      adSlot.defineSizeMapping(finalMapping);
    }

    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var marginBottom = window.getComputedStyle(image).marginBottom;

  var netlink_inImage = document.createElement("div");
  netlink_inImage.className = "netlink-inimage-ad";
  netlink_inImage.style.cssText = `position:relative;`;

  var inImage_Ad = document.createElement("div");
  inImage_Ad.style.cssText = `position:absolute;bottom:${_marginBottom}px;z-index:10;width:100%;`;

<<<<<<< HEAD
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
=======
  var divAdsCenter = document.createElement("center");
>>>>>>> fa0c31184b51a6baac9fdfeb0ea726b9409be2a5

  var divAds = document.createElement("div");
  divAds.id = gpt_id;

<<<<<<< HEAD
    return "div-netlink-ia-" + r + "-0";
  }
};
var MultiFixedAdxNetlink = function (adUnit, _divElement, _intTop) {
  var _body = window.top.document.querySelector("body");
  var gpt_script = document.createElement("script");
  gpt_script.async = true;
  gpt_script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.getElementsByTagName("head")[0].appendChild(gpt_script);
=======
  var inImage_Close = document.createElement("span");
  inImage_Close.innerHTML = "×";
  inImage_Close.style.cssText = "position:absolute;display:none;z-index:1;width:25px !important;height:25px !important;right:2px !important;top:-27px !important;cursor:pointer;font-size:20px;text-align:center;background:white;padding:2px;border-radius:20px;line-height:1;";
>>>>>>> fa0c31184b51a6baac9fdfeb0ea726b9409be2a5

  divAdsCenter.appendChild(divAds);
  inImage_Ad.appendChild(divAdsCenter);
  inImage_Ad.appendChild(inImage_Close);

<<<<<<< HEAD
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
      var _body = window.top.document.querySelector("body");
      var links = _body.querySelector("#" + _divElement);
      // console.log(links);
=======
  netlink_inImage.appendChild(inImage_Ad);
>>>>>>> fa0c31184b51a6baac9fdfeb0ea726b9409be2a5

  image.insertAdjacentElement("afterend", netlink_inImage);

  googletag.cmd.push(function () {
    googletag.display(gpt_id);
  });

<<<<<<< HEAD
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
  containerNL.style.setProperty("max-height", "100px", "important");
  // containerNL.style.setProperty("height", "50px", "important");

  var scriptTag = document.createElement("script");
  scriptTag.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  scriptTag.async = true;

  var scriptTag2 = document.createElement("script");
  scriptTag2.innerHTML = `window.googletag = window.googletag || {cmd: []};googletag.cmd.push(function() {googletag.defineSlot('${adUnit}', [[300, 50], [300, 100]], 'div-gpt-ad-1711076508079-0').addService(googletag.pubads());googletag.pubads().enableSingleRequest();googletag.enableServices();});`;

  _head.appendChild(scriptTag);
  _head.appendChild(scriptTag2);
  var divElementAds = document.createElement("center");

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
=======
  var timeout = 0;
  var interval = setInterval(function () {
    var iframeAdx = divAds.querySelector("iframe");
    if (iframeAdx && iframeAdx.getAttribute("data-load-complete") == "true") {
      inImage_Close.style.display = "block";
      clearInterval(interval);
>>>>>>> fa0c31184b51a6baac9fdfeb0ea726b9409be2a5
    }
    if(++timeout > 30) 
      clearInterval(interval);
  }, 1000);

  inImage_Close.addEventListener("click", function () {
    netlink_inImage.style.visibility = "hidden";
  });
}

function NetlinkAdxInImages(_adUnit, _start, _end, _adSize, _mapping = [], _element, _image = [], _marginBottom=0) {
  var images = document.body.querySelectorAll(_element);
  if(images.length == 0) return;

  for (var i = 1; i <= images.length; i++) {
    if(_start > _end) break;

    if(_image.length > 0 && !_image.includes(i)) continue;

    var adUnit = _adUnit + (_start++);

    NetlinkAdxInImage(adUnit, _adSize, _mapping, _element, i, _marginBottom);
  }
}

function NetlinkAdxInPage(_adUnit, _element, _marginTop = -1) {
  if (window.innerWidth >= 768) return;

  var ad_width = 300;
  var ad_height = 600;
  var gpt_id = randomID();

  checkGPTExists();

  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    googletag.defineSlot(_adUnit, [ad_width, ad_height], gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var midpoint = Math.min(Math.floor(document.querySelectorAll(_element).length / 2), 4);
  document.querySelectorAll(_element)[midpoint - 1].insertAdjacentHTML("afterend", "<div id='netlink-inpage-ad'></div>");

  var html = `<div id="inpage-content-ad" style="overflow: hidden; position: relative; z-index: 2; width: 100%;">
    <div id="inpage-ad" style="display:none;">
      <div id='${gpt_id}' style='min-width: ${ad_width}px; min-height: ${ad_height}px;'></div>
    </div>
  </div>`;
  document.getElementById("netlink-inpage-ad").insertAdjacentHTML("beforeend", html);

  googletag.cmd.push(() => {
    googletag.display(gpt_id);
  });

  window.addEventListener("scroll", function () {
    var inpageContentAds = document.getElementById("inpage-content-ad");
    if (!inpageContentAds) return;

    _marginTop >= 0 ? _marginTop : (window.innerHeight - ad_height) / 2;
    var top = inpageContentAds.getBoundingClientRect().top - _marginTop;
    var bot = top > 0 ? ad_height : ad_height + top;

    if (window.innerWidth < 768) {
      inpageContentAds.style.height = ad_height+"px";
      document.getElementById("inpage-ad").style.cssText = `
        display: block;
        clip: rect(${top}px, ${ad_width}px, ${bot}px, 0px);
        left: ${(window.innerWidth - ad_width) / 2}px;
        top: ${_marginTop}px;
        position: fixed;
        z-index: 10000;
      `;
    }
  });
}

//_insertPosition = 0: beforeend, position = 1: afterbegin, position = 2: beforebegin, position = 3: afterend
function NetlinkAdxMultipleSize(_adUnit, _element, _insertPosition=0, _marginTop=0) {
  if (window.innerWidth >= 768) return;

  MultipleSizeAdd(_adUnit, _element, _insertPosition);
  MultipleSizeScroll(_marginTop);
}

//_insertPosition = 0: beforeend, position = 1: afterbegin, position = 2: beforebegin, position = 3: afterend
function NetlinkAdxMultipleSizes(_adUnit, _start, _end, _elements, _insertPosition=2, _marginTop=0, _minScreen = 1) {
  if (window.innerWidth >= 768) return;

  var elements = document.querySelectorAll(_elements);
  if(elements.length == 0) return;

  var lastSpaceIndex = _elements.lastIndexOf(' ');
  var _element_str = lastSpaceIndex === -1 ? _elements : _elements.slice(0, lastSpaceIndex).trim() + ' > ' + _elements.slice(lastSpaceIndex + 1).trim();

  var min_ad = 0;
  for (var i = 0; i < elements.length; i++) {
    if(_start > _end) break;

    var _element = _element_str+':nth-of-type('+(i+1)+')';

    if(_insertPosition == 0 || _insertPosition == 3) {
      if(i == 0 || elements[i].offsetTop + elements[i].clientHeight - min_ad - (screen.height * _minScreen) >= 0) {
        var adUnit = _adUnit + (_start++);
        MultipleSizeAdd(adUnit, _element, _insertPosition);

        if(i < elements.length - 1)
          min_ad = elements[i+1].offsetTop;
      }
    } else if(_insertPosition == 1 || _insertPosition == 2) {
      if(i == 0 || elements[i].offsetTop - min_ad - (screen.height * _minScreen) >= 0) {
        var adUnit = _adUnit + (_start++);
        MultipleSizeAdd(adUnit, _element, _insertPosition);
        min_ad = elements[i].offsetTop;

        if(i < elements.length - 1) continue;
      }

      if(i == elements.length - 1 && elements[i].offsetTop + elements[i].clientHeight - min_ad - (screen.height * _minScreen) >= 0) {
        var adUnit = _adUnit + (_start++);
        MultipleSizeAdd(adUnit, _element, _insertPosition == 1 ? 0 : 3);
      }
    }
  }

  MultipleSizeScroll(_marginTop);
}

//_insertPosition = 0: beforeend, position = 1: afterbegin, position = 2: beforebegin, position = 3: afterend
function MultipleSizeAdd(_adUnit, _element, _insertPosition=0) {
  var element = document.body.querySelector(_element);
  if(element == null) return;

  checkGPTExists();
  
  var gpt_id = randomID();
  var adSize = [[300, 250], [300, 600]];
  
  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function () {
    googletag.defineSlot(_adUnit, adSize, gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var html = `<div class="netlink-multiplesize" style="margin-top:10px;margin-bottom:10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);">
      <span style="display: inline-block;width: 100%;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1;">Ads By Netlink</span>
      <div class="ms-content-ad" style="position: relative;min-height: 600px;">
        <center class="ms-ad">
          <div id="${gpt_id}"></div>
        </center>
      </div>
      <span style="display: inline-block;width: 100%;font-size: 14px;text-align: center;color: #9e9e9e;background-color: #f1f1f1;">Scroll to Continue</span>
    </div>`;

  if(_insertPosition == 1) element.insertAdjacentHTML("afterbegin", html);
  else if(_insertPosition == 2) element.insertAdjacentHTML("beforebegin", html);
  else if(_insertPosition == 3) element.insertAdjacentHTML("afterend", html);
  else element.insertAdjacentHTML("beforeend", html);

  googletag.cmd.push(function () {
    googletag.display(gpt_id);
  });
}

function MultipleSizeScroll(_marginTop) {
  document.addEventListener("scroll", function (e) {
    var elements = document.getElementsByClassName("netlink-multiplesize");
    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];

      var div = e.querySelector(".ms-ad");
      var h = e.querySelector(".ms-content-ad").clientHeight;
      var ch = e.querySelector(".ms-ad").clientHeight;

      var ap = e.querySelector(".ms-content-ad").getBoundingClientRect().top;
      if (ch < h) {
        if (ap >= _marginTop) {
          div.style.position = "";
          div.style.top = "";
          div.style.bottom = "";
          div.style.left = "";
          div.style.transform = "";
        } else if (ap < _marginTop && Math.abs(ap) + ch < h - _marginTop) {
          div.style.position = "fixed";
          div.style.top = _marginTop + "px";
          div.style.bottom = "";
          div.style.left = "50%";
          div.style.transform = "translateX(-50%)";
        } else if (Math.abs(ap) + ch >= h - _marginTop) {
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

function NetlinkAdxFirstView(_adUnit, _adSize = [300, 600]) {
  if (window.innerWidth >= 768) return;

  checkGPTExists();

  var gpt_id = randomID();

  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
    googletag.defineSlot(_adUnit, _adSize, gpt_id).addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });

  var html = `<div class="netlink-firstview" style="display: block; position: fixed; width: 100%; height: 100vh; top: 0px; left: 0px; text-align: center; opacity: 1; background-color: rgba(255, 255, 255, 0.7); visibility: hidden; z-index: 2147483647;">
      <div class="netlink-firstview-close" style="display: none; position: absolute; width: 60px !important; height: 25px !important; top: 5% !important; right: 0px !important; cursor: pointer; background: rgba(183, 183, 183, 0.71); padding: 2px; border-radius: 20px 0px 0px 20px;" z-index: 99;>
        <span style="position: absolute; font-size: 15px; top: 50%; left: 50%; transform: translate(-50%, -50%);">close</span>
      </div>
      <div id="${gpt_id}" style="position: absolute; top: 50%; transform: translate(-50%, -50%); left: 0px;"></div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);

  googletag.cmd.push(function() {
    googletag.display(gpt_id);
  });

  document.body.querySelector('.netlink-firstview-close').addEventListener("click", function () {
    document.body.querySelector('.netlink-firstview').style.display = "none";
  });

  var timer = 0
  var interval = setInterval(() => {
    var ads = document.getElementById(gpt_id).querySelector("iframe");
    if (ads && ads.getAttribute("data-load-complete") == "true") {
      clearInterval(interval);

      document.body.querySelector('netlink-firstview').style.visibility = "visible";
      document.body.querySelector('netlink-firstview-close').style.display = "block";
    }

    if(++timer > 15) {
      clearInterval(interval);
    }
  }, 1000);
}

function NetlinkAdxRewarded(_adUnit) {
  checkGPTExists();

  window.googletag = window.googletag || { cmd: [] }; 
  var rewardedSlot; 
  var rewardPayload;
  googletag.cmd.push(() => { 
    rewardedSlot = googletag.defineOutOfPageSlot(_adUnit, googletag.enums.OutOfPageFormat.REWARDED); 
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

//===========================================================================
//ADSENSE
//===========================================================================

var adSense_client = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3166493188367342";

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

  var inImage_CloseFVAdx = document.createElement("div");
  inImage_CloseFVAdx.style.position = "absolute";
  inImage_CloseFVAdx.style.setProperty("display", "none", "important");
  inImage_CloseFVAdx.style.zIndex = 99;
  inImage_CloseFVAdx.style.setProperty("width", "60px", "important");
  inImage_CloseFVAdx.style.setProperty("height", "25px", "important");
  inImage_CloseFVAdx.style.setProperty("right", "0px", "important");
  inImage_CloseFVAdx.style.setProperty("top", "5%", "important");
  inImage_CloseFVAdx.style.cursor = "pointer";

  inImage_CloseFVAdx.style.background = "#b7b7b7b5";
  inImage_CloseFVAdx.style.padding = "2px";
  inImage_CloseFVAdx.style.borderRadius = "20px 0px 0px 20px";

  var spanCloseNLFVAdx = document.createElement("span");
  spanCloseNLFVAdx.innerHTML = "close";
  spanCloseNLFVAdx.style.position = "absolute";
  spanCloseNLFVAdx.style.fontSize = "15px";
  spanCloseNLFVAdx.style.top = "50%";
  spanCloseNLFVAdx.style.left = "50%";
  spanCloseNLFVAdx.style.transform = "translate(-50%, -50%)";

  inImage_CloseFVAdx.appendChild(spanCloseNLFVAdx);

  mobileFVAdxElement.appendChild(inImage_CloseFVAdx);
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
  inImage_CloseFVAdx.addEventListener("click", function () {
    mobileFVAdxElement.remove();
  });

  var adCheck = setIntervalWithTimeout(
    function () {
      if (divElement.getAttribute("data-ad-status") == "filled") {
        var iframeAdx = divElement.querySelector("iframe");
        if (iframeAdx) {
          if (iframeAdx.getAttribute("data-load-complete") == "true") {
            mobileFVAdxElement.style.visibility = "visible";
            inImage_CloseFVAdx.style.display = "block";
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



//===========================================================================//
//===========================================================================//
//===========================================================================//
function checkGPTExists() {
  var scripts = document.head.querySelectorAll('script[src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"]');
  if (scripts.length > 0) {
    return true;
  } else {
    var gpt_script = document.createElement("script");
    gpt_script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    gpt_script.async = true;
    document.head.appendChild(gpt_script);

    return false;
  }
}

var ar = [];
function randomID() {
  var r = Math.random().toString().substring(2);
  while (1) {
    if (!ar.includes(r)) {
      break;
    }
    r = Math.random().toString().substring(2);
  }
  ar.push(r);

  return "netlink-gpt-ad-" + r + "-0";
}

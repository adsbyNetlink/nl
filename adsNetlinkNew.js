function NetlinkAdxStickyExt(_adUnit, _adPosition = 0, _closeBtnPos = 1) {
  checkGPTExists();
  window.googletag = window.googletag || { cmd: [] };

  googletag.cmd.push(function() {
    var isTop = (document.body.clientWidth < 768 && _adPosition !== 0);
    var position = isTop ? googletag.enums.OutOfPageFormat.TOP_ANCHOR : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR;

    var anchorSlot = googletag.defineOutOfPageSlot(_adUnit, position);
    if (anchorSlot) {
      anchorSlot.addService(googletag.pubads());
      googletag.enableServices();
      googletag.display(anchorSlot);
    }

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === anchorSlot && !event.isEmpty) {
        var googleContainer = document.querySelector('.google-anchor-ad-container') 
                               || document.querySelector('div[id^="googletag_anchor_container"]');
        if (googleContainer) {
          if (!googleContainer.id) googleContainer.id = 'nl-sticky-wrapper-' + randomID();
          renderNetlinkMegaClose(googleContainer.id, anchorSlot, _adPosition, _closeBtnPos);
        }
      }
    });
  });
}

function NetlinkAdxCatfish(_adUnit, _adSize = [320, 100], _closeBtnPos = 1, _bottom = 0) {
  checkGPTExists();
  const gpt_id = randomID();
  const containerId = 'nl-catfish-container-' + gpt_id;

  const html = `
    <div id="${containerId}" style="position: fixed; bottom: ${_bottom}px; left: 0; width: 100%; z-index: 2147483646; display: flex; justify-content: center; background: transparent; pointer-events: none;">
        <div style="position: relative; pointer-events: auto; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1);">
            <div id="${gpt_id}" style="min-width: ${_adSize[0]}px; min-height: ${_adSize[1]}px;"></div>
        </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    const slot = googletag.defineSlot(_adUnit, _adSize, gpt_id).addService(googletag.pubads());
    googletag.enableServices();
    googletag.display(gpt_id);

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === slot && !event.isEmpty) {
        // Với Catfish, nút Close sẽ nằm trên wrapper của ad (vPos luôn = 0 vì là Catfish)
        const adWrapper = document.getElementById(gpt_id).parentElement;
        if (!adWrapper.id) adWrapper.id = 'wrapper-' + gpt_id;
        renderNetlinkMegaClose(adWrapper.id, slot, 0, _closeBtnPos);
      }
    });
  });
}
/**
 * NetlinkAdxCatfishExt: Hiện khi cuộn xuống, ẨN khi cuộn lên
 * @param {string} _adUnit - Mã đơn vị quảng cáo từ GAM
 * @param {number} _isDisplay - 0: Cả PC & MB, 1: Chỉ PC, 2: Chỉ Mobile
 * @param {array} _pageView - [1, 3, 5]: Hiện ở lượt xem trang thứ 1, 3, 5
 * @param {number} _closeBtnPos - Vị trí nút đóng (0, 1, 2)
 */
function NetlinkAdxCatfishExt(_adUnit, _isDisplay = 0, _pageView = [0], _closeBtnPos = 1) {
    var isMobile = window.innerWidth < 768;

    if (_isDisplay === 1 && isMobile) return; 
    if (_isDisplay === 2 && !isMobile) return; 

    // 1. Logic đếm trang (Bắt đầu từ 1)
    var storageKey = 'nl_cat_ext_pv_v2_' + _adUnit.replace(/[^a-zA-Z0-9]/g, '');
    var currentPV = sessionStorage.getItem(storageKey);
    currentPV = (currentPV === null) ? 1 : parseInt(currentPV) + 1;
    sessionStorage.setItem(storageKey, currentPV);

    if (_pageView.length > 0 && _pageView[0] !== 0) {
        if (_pageView.indexOf(currentPV) === -1) return;
    }

    // 2. Logic Hiển thị/Ẩn khi cuộn chuột
    var hasRendered = false;
    var lastScrollTop = 0;
    var gpt_id = randomID();
    var containerId = 'nl-cat-ext-container-' + gpt_id;

    window.addEventListener('scroll', function() {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        var container = document.getElementById(containerId);

        // A. Nếu cuộn xuống quá 100px: Render ads (nếu chưa có) và Hiện ads
        if (st > lastScrollTop && st > 100) {
            if (!hasRendered) {
                hasRendered = true;
                renderCatfishAd(gpt_id, containerId);
            } else if (container) {
                container.style.display = 'flex';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }
        } 
        // B. Nếu cuộn ngược lên trên: Ẩn ads (giữ lại trong DOM để không tốn tài nguyên load lại)
        else if (st < lastScrollTop) {
            if (container) {
                container.style.opacity = '0';
                container.style.transform = 'translateY(100%)';
                // Đợi transition xong thì ẩn hẳn display để không chặn click
                setTimeout(function() { 
                    if(container.style.opacity === '0') container.style.display = 'none'; 
                }, 400);
            }
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);

    function renderCatfishAd(_id, _cId) {
        checkGPTExists();
        var html = `
            <div id="${_cId}" style="position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2147483646; display: flex; justify-content: center; pointer-events: none; transition: all 0.4s ease-in-out; opacity: 0; transform: translateY(100%);">
                <div id="wrapper-cat-${_id}" style="position: relative; pointer-events: auto; background: transparent; line-height: 0;">
                    <div id="${_id}"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", html);

        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(function() {
            var mapping = googletag.sizeMapping()
                .addSize([1024, 0], [[728, 90]])
                .addSize([0, 0], [[300, 100], [300, 50], [320, 100], [320, 50]])
                .build();

            var slot = googletag.defineSlot(_adUnit, [[728, 90], [300, 100], [300, 50], [320, 100], [320, 50]], _id)
                .defineSizeMapping(mapping)
                .addService(googletag.pubads());

            googletag.enableServices();
            googletag.display(_id);

            googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                if (event.slot === slot && !event.isEmpty) {
                    var container = document.getElementById(_cId);
                    var wrapper = document.getElementById('wrapper-cat-' + _id);
                    if (container) {
                        container.style.display = 'flex';
                        setTimeout(() => { container.style.opacity = '1'; container.style.transform = 'translateY(0)'; }, 100);
                    }
                    if (wrapper) {
                        wrapper.style.background = '#ffffff';
                        wrapper.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.15)';
                        wrapper.style.padding = '2px';
                    }
                    renderNetlinkMegaClose('wrapper-cat-' + _id, slot, 0, _closeBtnPos);
                }
            });
        });
    }
}

// 1. Inject CSS dùng chung cho nút Close
function injectNetlinkStyles() {
  if (document.getElementById('netlink-ads-style')) return;
  var style = document.createElement('style');
  style.id = 'netlink-ads-style';
  style.innerHTML = `
    .nl-mega-close {
      opacity: 0;
      transition: opacity 0.5s ease-in-out, transform 0.2s;
      z-index: 2147483647;
      background: rgba(60, 60, 60, 0.95);
      color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 11px;
      font-weight: bold;
      padding: 5px 12px;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .nl-mega-close:hover { background: #000; transform: scale(1.05); }
    .nl-show { opacity: 1; }
  `;
  document.head.appendChild(style);
}

// 2. Hàm Render nút Close Mega
function renderNetlinkMegaClose(_targetId, _slot, _vPos = 0, _hPos = 1) {
  injectNetlinkStyles();
  var target = document.getElementById(_targetId);
  if (!target) return;

  var btn = document.createElement('button');
  btn.className = 'nl-mega-close';
  btn.innerHTML = 'CLOSE ✕';
  btn.style.position = 'absolute';

  // Vertical (vPos): 0 là Bottom (nút nằm trên banner), 1 là Top (nút nằm dưới banner)
  if (_vPos === 1) {
    btn.style.top = '100%';
    btn.style.borderRadius = '0 0 5px 5px';
  } else {
    btn.style.bottom = '100%';
    btn.style.borderRadius = '5px 5px 0 0';
  }

  // Horizontal (hPos): 0: Trái, 1: Phải, 2: Giữa
  if (_hPos === 0) {
    btn.style.left = '0';
  } else if (_hPos === 2) {
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
  } else {
    btn.style.right = '0';
  }

  btn.onclick = function(e) {
    e.preventDefault();
    if (_slot) googletag.destroySlots([_slot]);
    // Tìm container gốc (thường chứa chữ 'container' trong ID) để xóa sạch
    var root = target.id.indexOf('container') > -1 ? target : target.parentElement;
    if (root) root.remove();
  };

  target.appendChild(btn);
  setTimeout(function() { btn.classList.add('nl-show'); }, 200);
}

/**
 * NetlinkAdxWipe: Quảng cáo góc dưới bên phải (300x250)
 * @param {string} _adUnit - Mã đơn vị quảng cáo
 * @param {number} _delay - Thời gian chờ hiển thị (tính bằng mili giây, ví dụ 3000 hoặc 5000)
 * @param {number} _closeBtnPos - Vị trí nút đóng (0, 1, 2)
 */
function NetlinkAdxWipe(_adUnit, _delay = 3000, _closeBtnPos = 1) {
  // Chỉ chạy trên Mobile theo yêu cầu trước đó của anh
  if (window.innerWidth >= 768) return;

  // Sử dụng tham số _delay để điều chỉnh thời gian hiển thị
  setTimeout(function() {
    checkGPTExists();
    var gpt_id = randomID();
    var containerId = 'nl-wipe-container-' + gpt_id;
    var html = `
      <div id="${containerId}" style="position: fixed; bottom: 200px; right: 10px; z-index: 2147483646; display: none; transition: opacity 0.5s;">
          <div id="wrapper-${gpt_id}" style="position: relative; background: #ffffff; box-shadow: 0 0 15px rgba(0,0,0,0.2); padding: 2px; border-radius: 4px;">
              <div id="${gpt_id}" style="width: 300px; height: 250px;"></div>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);

    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(function() {
      // Định dạng 300x250 cố định cho Wipe Mobile
      var slot = googletag.defineSlot(_adUnit, [300, 250], gpt_id).addService(googletag.pubads());
      googletag.enableServices();
      googletag.display(gpt_id);

      googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        if (event.slot === slot && !event.isEmpty) {
          var container = document.getElementById(containerId);
          if (container) container.style.display = 'block';

          // Gắn nút Close Mega dùng chung (vPos=0 nằm trên đỉnh banner)
          renderNetlinkMegaClose('wrapper-' + gpt_id, slot, 0, _closeBtnPos);
        } else if (event.slot === slot && event.isEmpty) {
          var container = document.getElementById(containerId);
          if (container) container.remove();
        }
      });
    });
  }, _delay); 
}
/**
 * NetlinkAdxBalloon: Quảng cáo nổi góc dưới bên phải - CHỈ HIỂN THỊ PC
 * @param {string} _adUnit - Mã đơn vị quảng cáo
 * @param {array} _adSize - Mảng kích thước mặc định khối lớn
 * @param {number} _closeBtnPos - Vị trí nút đóng (0: trái, 1: phải, 2: giữa)
 */
function NetlinkAdxBalloon(_adUnit, _adSize = [[300, 250], [336, 280], [300, 300], [300, 400]], _closeBtnPos = 1) {
  if (window.innerWidth < 768) return;
  checkGPTExists();
  var gpt_id = randomID();
  var containerId = 'nl-balloon-container-' + gpt_id;
  var html = `
    <div id="${containerId}" style="position: fixed; bottom: 10px; right: 10px; z-index: 2147483646; display: none; transition: all 0.3s;">
        <div id="wrapper-${gpt_id}" style="position: relative; background: #ffffff; box-shadow: 0 0 15px rgba(0,0,0,0.2); padding: 2px; border-radius: 4px; max-width: 340px;">
            <div id="${gpt_id}" style="min-width: 300px;"></div>
        </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);
  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    var slot = googletag.defineSlot(_adUnit, _adSize, gpt_id).addService(googletag.pubads());
    googletag.enableServices();
    googletag.display(gpt_id);
    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === slot && !event.isEmpty) {
        var container = document.getElementById(containerId);
        if (container) container.style.display = 'block';
        renderNetlinkMegaClose('wrapper-' + gpt_id, slot, 0, _closeBtnPos);
      } else if (event.slot === slot && event.isEmpty) {
        var container = document.getElementById(containerId);
        if (container) container.remove();
      }
    });
  });
}

/**
 * NetlinkAdxMultiads: Tự động chèn nhiều quảng cáo khi cuộn trang
 * @param {string} _adUnit - Mã đơn vị quảng cáo từ GAM
 */
function NetlinkAdxMultiads(adUnit) {
    console.log("%c[MultiAds] Init Multi Ads", "color: blue; font-weight:bold");

    var isMobile = window.innerWidth < 768;
    var pGap = isMobile ? 4 : 6;
    var adCount = 0;
    var lastIndex = -10;
    var locking = false;

    window.googletag = window.googletag || { cmd: [] };

    function insertAd(targetP) {
        adCount++;

        var gptId = 'gpt-multi-' + Date.now() + '-' + adCount;
        var wrapId = gptId + '-wrap';

        targetP.insertAdjacentHTML('afterend', `
            <div id="${wrapId}" style="margin:20px auto;text-align:center;clear:both">
                <div id="${gptId}" style="min-height:50px"></div>
            </div>
        `);

        googletag.cmd.push(function () {
            var mapping = googletag.sizeMapping()
                .addSize([1024, 0], [[336, 280], [300, 250]])
                .addSize([0, 0], [[320, 100], [320, 50], [300, 250]])
                .build();

            var slot = googletag.defineSlot(
                adUnit,
                [[336, 280], [300, 250], [320, 100], [320, 50]],
                gptId
            ).defineSizeMapping(mapping)
             .addService(googletag.pubads());

            googletag.display(gptId);

            // 👉 Mobile cần delay refresh
            setTimeout(function () {
                try {
                    googletag.pubads().refresh([slot]);
                } catch (e) {}
            }, isMobile ? 1200 : 300);

            googletag.pubads().addEventListener('slotRenderEnded', function (e) {
                if (e.slot === slot && e.isEmpty) {
                    console.log(`[MultiAds] Ad ${adCount} EMPTY`);
                    var wrap = document.getElementById(wrapId);
                    if (wrap) wrap.style.display = 'none';
                }
            });
        });
    }

    window.addEventListener('scroll', function () {
        if (locking) return;

        var content = document.querySelector(
            'article, .entry-content, .post-content, .content-detail'
        );
        if (!content) return;

        var ps = content.querySelectorAll('p');
        var viewBottom = window.scrollY + window.innerHeight;

        for (let i = 0; i < ps.length; i++) {
            var top = ps[i].getBoundingClientRect().top + window.scrollY;

            if (
                top > viewBottom &&
                i > lastIndex + pGap &&
                ps[i].innerText.trim().length > 30
            ) {
                locking = true;
                lastIndex = i;
                insertAd(ps[i]);

                setTimeout(() => locking = false, 1500);
                break;
            }
        }
    }, { passive: true });
}

/**
 * NetlinkAdxFirstView: Popup nổi giữa màn hình ngay khi vào trang
 * Tự động mapping size, không cần element, bắt buộc có nút Close
 */
function NetlinkAdxFirstView(_adUnit) {
  checkGPTExists();
  var gpt_id = randomID();
  var containerId = 'nl-firstview-popup-' + gpt_id;

  // Tạo Overlay bao phủ màn hình
  var html = `
    <div id="${containerId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483646; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center;">
        <div id="wrapper-${gpt_id}" style="position: relative; background: #fff; line-height: 0;">
            <div id="${gpt_id}"></div>
        </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    // Tập hợp size linh hoạt để tăng CTR
    var allSizes = [[300, 250], [336, 280], [300, 600], [300, 400]];
    
    var mapping = googletag.sizeMapping()
      .addSize([1024, 768], [[300, 600], [300, 400], [336, 280], [300, 250]]) // PC
      .addSize([0, 0], [[300, 250], [336, 280]]) // Mobile
      .build();

    var slot = googletag.defineSlot(_adUnit, allSizes, gpt_id)
      .defineSizeMapping(mapping)
      .addService(googletag.pubads());

    googletag.enableServices();
    googletag.display(gpt_id);

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === slot && !event.isEmpty) {
        // Gắn nút Close Mega (vPos=0 để nằm trên đỉnh banner)
        renderNetlinkMegaClose('wrapper-' + gpt_id, slot, 0, 1);
      } else if (event.slot === slot && event.isEmpty) {
        document.getElementById(containerId).remove();
      }
    });
  });
}

/**
 * NetlinkAdxFirstViewExt: Popup nổi linh hoạt với điều kiện thiết bị và trang con
 * @param {string} _adUnit - Mã đơn vị quảng cáo từ GAM
 * @param {number} _isDisplay - 0: Cả PC & MB, 1: Chỉ PC, 2: Chỉ Mobile
 * @param {array} _pageView - [0]: Tất cả các trang, [1, 3, 5]: Chỉ hiện ở trang con thứ 1, 3, 5
 * @param {number} _closeBtnPos - Vị trí nút đóng (0, 1, 2)
 */
function NetlinkAdxFirstViewExt(_adUnit, _isDisplay = 0, _pageView = [0], _closeBtnPos = 1) {
    var isMobile = window.innerWidth < 768;

    // 1. Kiểm tra điều kiện thiết bị
    if (_isDisplay === 1 && isMobile) return; 
    if (_isDisplay === 2 && !isMobile) return; 

    // 2. Logic đếm trang (Landing = 0, Trang con 1 = 1...)
    var storageKey = 'nl_ext_pv_' + _adUnit.replace(/[^a-zA-Z0-9]/g, '');
    var currentPV = sessionStorage.getItem(storageKey);
    currentPV = (currentPV === null) ? 1 : parseInt(currentPV);
    sessionStorage.setItem(storageKey, currentPV + 1);

    if (_pageView.length > 0 && _pageView[0] !== 0) {
        if (_pageView.indexOf(currentPV) === -1) return;
    }

    checkGPTExists();
    var gpt_id = randomID();
    var containerId = 'nl-firstview-ext-container-' + gpt_id;

    var html = `
        <div id="${containerId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483646; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;">
            <div id="wrapper-ext-${gpt_id}" style="position: relative; background: #fff; line-height: 0; box-shadow: 0 0 30px rgba(0,0,0,0.6); max-width: 95vw; max-height: 95vh; overflow: visible;">
                <div id="${gpt_id}"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);

    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(function() {
        // LUỒNG CHỌN SIZE LINH HOẠT THEO THIẾT BỊ
        var mapping = googletag.sizeMapping()
            // PC: Cho phép các size dọc lớn và size khối
            .addSize([1024, 0], [[300, 600], [300, 400], [336, 280], [300, 250]])
            // Tablet: Ưu tiên các size khối
            .addSize([768, 0], [[336, 280], [300, 250]])
            // Mobile: Tuyệt đối không lấy size [300, 600] hay [300, 400] để tránh vỡ màn hình
            .addSize([0, 0], [[300, 600], [300, 250], [336, 280]])
            .build();

        // Tổng hợp tất cả size có thể chạy cho Ad Unit này
        var allPossibleSizes = [[300, 600], [300, 400], [336, 280], [300, 250]];

        var slot = googletag.defineSlot(_adUnit, allPossibleSizes, gpt_id)
            .defineSizeMapping(mapping)
            .addService(googletag.pubads());

        googletag.enableServices();
        googletag.display(gpt_id);

        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            if (event.slot === slot && !event.isEmpty) {
                renderNetlinkMegaClose('wrapper-ext-' + gpt_id, slot, 0, _closeBtnPos);
				var closeBtn = document.querySelector('#wrapper-ext-' + gpt_id + ' .nl-mega-close');
                if(closeBtn) {
                    closeBtn.style.zIndex = "9999";
                    closeBtn.style.top = "-15px";
                }
            } else if (event.slot === slot && event.isEmpty) {
                var container = document.getElementById(containerId);
                if (container) container.remove();
            }
        });
    });
}

/**
 * NetlinkAdxInPage: Hiển thị quảng cáo tại chỗ (Inline)
 * Đã lược bỏ _element, giữ nguyên kích thước mặc định [300, 600]
 * @param {string} _adUnit - Mã đơn vị quảng cáo từ GAM
 * @param {number} _marginTop - Khoảng cách phía trên (mặc định -1)
 */
function NetlinkAdxInPage(_adUnit, _marginTop = -1) {
  checkGPTExists();
  var gpt_id = randomID();
  
  console.log(`%c[InPage] Khởi tạo AdUnit: ${_adUnit}`, "color: #8e44ad; font-weight: bold;");
  
  var adDiv = document.createElement('div');
  adDiv.id = gpt_id;
  adDiv.style.textAlign = "center";
  adDiv.style.minHeight = "100px";
  if (_marginTop != -1) adDiv.style.marginTop = _marginTop + "px";

  var currentScript = document.currentScript;
  if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.insertBefore(adDiv, currentScript);
      console.log(`%c[InPage] -> Đã chèn container tại vị trí script. ID: ${gpt_id}`, "color: #9b59b6;");
  } else {
      document.write('<div id="' + gpt_id + '" style="text-align:center;' + (_marginTop != -1 ? 'margin-top:' + _marginTop + 'px;' : '') + '"></div>');
  }

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    var slot = googletag.defineSlot(_adUnit, [300, 600], gpt_id).addService(googletag.pubads());
    googletag.enableServices();
    googletag.display(gpt_id);

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === slot) {
        if (!event.isEmpty) {
          console.log(`%c[InPage] THÀNH CÔNG: Ad đã hiển thị.`, "color: white; background: #27ae60; padding: 2px 5px;");
        } else {
          console.warn(`[InPage] TRỐNG: Unit ${_adUnit} không có ads.`);
          adDiv.style.display = 'none';
        }
      }
    });
  });
}

/**
 * NetlinkAdxScrollReveal: Quảng cáo ẩn dưới nội dung, cuộn để lộ cho ADX
 * @param {string} _adUnit - Mã đơn vị quảng cáo
 * @param {string} _target - (Tùy chọn) Selector vùng nội dung nếu muốn chỉ định thủ công
 */
function NetlinkAdxScrollReveal(_adUnit, _target = null) {
    if (window.innerWidth >= 768) return; 

    var contentArea = findSmartContentArea(_target);
    if (!contentArea) return;

    var paragraphs = contentArea.querySelectorAll('p');
    if (paragraphs.length < 2) return;

    checkGPTExists(); 
    var gpt_id = randomID(); 
    var containerId = 'nl-reveal-adx-' + gpt_id;

    var targetElement = paragraphs[Math.floor(paragraphs.length / 2)];
    
    // Tăng height lên 350px để chứa vừa khít size 336x280 và padding
    var html = `
        <div id="${containerId}-wrapper" style="width: 100%; height: 350px; margin: 30px 0; position: relative; clip-path: inset(0 0 0 0); -webkit-clip-path: inset(0 0 0 0);">
            <div id="${containerId}" style="position: fixed; bottom: 0; left: 0; width: 100%; height: 350px; z-index: -1; display: none; justify-content: center; align-items: center; background: #ffffff;">
                <div id="inner-${gpt_id}" style="position: relative; line-height: 0; min-width: 300px; min-height: 250px;">
                    <div id="${gpt_id}"></div>
                </div>
            </div>
        </div>
    `;
    targetElement.insertAdjacentHTML('afterend', html);

    handleScrollReveal(containerId);

    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(function() {
        // Định nghĩa các size chuẩn anh yêu cầu
        var slot = googletag.defineSlot(_adUnit, [[336, 280], [300, 250]], gpt_id).addService(googletag.pubads());
        googletag.enableServices();
        googletag.display(gpt_id);

        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            if (event.slot === slot && event.isEmpty) {
                var wrapper = document.getElementById(containerId + '-wrapper');
                if (wrapper) wrapper.remove();
            }
        });
    });
}

/**
 * NetlinkAsenseScrollReveal: Quảng cáo ẩn dưới nội dung, cuộn để lộ cho Adsense
 * @param {string} _client - Mã ca-pub
 * @param {string} _slot - Mã slot quảng cáo
 * @param {string} _target - (Tùy chọn) Selector vùng nội dung
 */
function NetlinkAsenseScrollReveal(_client, _slot, _target = null) {
    // 1. Chỉ chạy trên Mobile
    if (window.innerWidth >= 768) return;

    // 2. Kiểm tra và nạp JS gốc của Google Adsense (Dùng hàm anh đã viết)
    checkAdsenseJSExists(_client);

    // 3. Tìm vùng nội dung thông minh
    var contentArea = findSmartContentArea(_target);
    if (!contentArea) return;

    var paragraphs = contentArea.querySelectorAll('p');
    if (paragraphs.length < 2) return;

    var revealId = 'nl-reveal-asense-' + Math.floor(Math.random() * 1000000);
    var targetElement = paragraphs[Math.floor(paragraphs.length / 2)];

    // 4. Tạo cấu trúc Reveal (Chiều cao 350px để thoải mái cho size 336x280)
    var html = `
        <div id="${revealId}-wrapper" style="width: 100%; height: 350px; margin: 30px 0; position: relative; clip-path: inset(0 0 0 0); -webkit-clip-path: inset(0 0 0 0);">
            <div id="${revealId}" style="position: fixed; bottom: 0; left: 0; width: 100%; height: 350px; z-index: -1; display: none; justify-content: center; align-items: center; background: #ffffff;">
                <div style="width: 100%; text-align: center; line-height: 0;">
                    <ins class="adsbygoogle"
                         style="display:inline-block;width:336px;height:280px"
                         data-ad-client="${_client}"
                         data-ad-slot="${_slot}"></ins>
                </div>
            </div>
        </div>
    `;
    targetElement.insertAdjacentHTML('afterend', html);

    // 5. Kích hoạt logic cuộn để hiển thị
    handleScrollReveal(revealId);

    // 6. Push quảng cáo (Cần bọc trong try-catch để tránh lỗi JS nếu thư viện chưa load kịp)
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error("Adsense Reveal Error:", e);
    }
}

// Hàm tìm vùng nội dung thông minh
function findSmartContentArea(_target) {
    if (_target) return document.querySelector(_target);

    // Danh sách ưu tiên các class nội dung phổ biến
    var commonSelectors = ['article', '.post-content', '.entry-content', '.content-detail', '.detail-content', '.fck_detail'];
    for (var i = 0; i < commonSelectors.length; i++) {
        var el = document.querySelector(commonSelectors[i]);
        if (el && el.querySelectorAll('p').length > 2) return el;
    }

    // Nếu không khớp class nào, tìm thẻ div chứa nhiều thẻ <p> nhất
    var bestDiv = null;
    var maxP = 0;
    document.querySelectorAll('div').forEach(div => {
        var pCount = div.querySelectorAll(':scope > p').length;
        if (pCount > maxP) {
            maxP = pCount;
            bestDiv = div;
        }
    });
    return bestDiv || document.body;
}

// Hàm xử lý logic hiển thị khi cuộn
function handleScrollReveal(_containerId) {
    window.addEventListener('scroll', function() {
        var wrapper = document.getElementById(_containerId + '-wrapper');
        var adContainer = document.getElementById(_containerId);
        if (!wrapper || !adContainer) return;

        var rect = wrapper.getBoundingClientRect();
        // Chỉ hiển thị 'fixed' khi vùng wrapper nằm trong khung nhìn (Viewport)
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            adContainer.style.display = 'flex';
        } else {
            adContainer.style.display = 'none';
        }
    });
}
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

function checkAdsenseJSExists(client_id) {
  var scripts = document.head.querySelectorAll('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+client_id+'"]');
  if (scripts.length > 0) {
    return true;
  } else {
    var adsense_script = document.createElement("script");
    adsense_script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+client_id;
    adsense_script.async = true;
    adsense_script.crossOrigin = "anonymous";
    document.head.appendChild(adsense_script);

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





























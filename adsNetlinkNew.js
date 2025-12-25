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

function NetlinkAdxCatfishExt(_adUnit, _closeBtnPos = 1) {
  checkGPTExists();
  var gpt_id = randomID();
  var containerId = 'nl-catfish-container-' + gpt_id;

  // Tạo container cố định ở Bottom
  var html = `
    <div id="${containerId}" style="position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2147483646; display: flex; justify-content: center; pointer-events: none;">
        <div id="wrapper-${gpt_id}" style="position: relative; pointer-events: auto; background: transparent; transition: all 0.3s;">
            <div id="${gpt_id}"></div>
        </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    // Tự động Mapping kích thước theo thiết bị
    var mapping = googletag.sizeMapping()
      .addSize([1024, 768], [[728, 90], [970, 90], [970, 250]]) // PC: Banner to
      .addSize([0, 0], [[320, 100], [320, 50], [300, 100], [300, 50]]) // Mobile: Banner nhỏ
      .build();

    var allPossibleSizes = [[728, 90], [970, 90], [970, 250], [320, 100], [320, 50], [300, 100], [300, 50]];
    
    var slot = googletag.defineSlot(_adUnit, allPossibleSizes, gpt_id)
      .defineSizeMapping(mapping)
      .addService(googletag.pubads());

    googletag.enableServices();
    googletag.display(gpt_id);

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === slot && !event.isEmpty) {
        // Render nút Close lên wrapper
        renderNetlinkMegaClose('wrapper-' + gpt_id, slot, 0, _closeBtnPos);
        
        // Chỉ hiện nền trắng và đổ bóng khi có quảng cáo
        var wrapper = document.getElementById('wrapper-' + gpt_id);
        if (wrapper) {
            wrapper.style.background = '#ffffff';
            wrapper.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.15)';
        }
      } else if (event.slot === slot && event.isEmpty) {
        // Xóa container nếu không có quảng cáo trả về
        var container = document.getElementById(containerId);
        if (container) container.remove();
      }
    });
  });
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

Dạ em sơ suất quá, em đã cập nhật lại điều kiện kiểm tra thiết bị.

Để chỉ hiển thị trên PC và ẩn hoàn toàn trên Mobile, em đã thêm dòng kiểm tra window.innerWidth < 768. Nếu là Mobile, hàm sẽ kết thúc ngay lập tức (return) để không tốn tài nguyên tải script quảng cáo.

Dưới đây là bản chuẩn cuối cùng của hàm NetlinkAdxBalloon:

JavaScript

/**
 * NetlinkAdxBalloon: Quảng cáo nổi góc dưới bên phải - CHỈ HIỂN THỊ PC
 * @param {string} _adUnit - Mã đơn vị quảng cáo
 * @param {array} _adSize - Mảng kích thước mặc định khối lớn
 * @param {number} _closeBtnPos - Vị trí nút đóng (0: trái, 1: phải, 2: giữa)
 */
function NetlinkAdxBalloon(_adUnit, _adSize = [[300, 250], [336, 280], [300, 300], [300, 400]], _closeBtnPos = 1) {
  // CHỈ HIỂN THỊ TRÊN PC (Màn hình >= 768px)
  if (window.innerWidth < 768) return;

  checkGPTExists();
  var gpt_id = randomID();
  var containerId = 'nl-balloon-container-' + gpt_id;

  // 1. Tạo Container cố định góc phải màn hình
  var html = `
    <div id="${containerId}" style="position: fixed; bottom: 10px; right: 10px; z-index: 2147483646; display: none; transition: all 0.3s;">
        <div id="wrapper-${gpt_id}" style="position: relative; background: #ffffff; box-shadow: 0 0 15px rgba(0,0,0,0.2); padding: 2px; border-radius: 4px;">
            <div id="${gpt_id}"></div>
        </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    // 2. Khai báo Slot với danh sách size khối lớn
    var slot = googletag.defineSlot(_adUnit, _adSize, gpt_id)
      .addService(googletag.pubads());

    googletag.enableServices();
    googletag.display(gpt_id);

    // 3. Lắng nghe sự kiện để hiển thị và gắn nút Close dùng chung
    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot === slot && !event.isEmpty) {
        // Hiện container khi có quảng cáo trả về
        var container = document.getElementById(containerId);
        if (container) container.style.display = 'block';

        // Gắn nút Close lên wrapper (vPos = 0: nút nằm trên đỉnh banner)
        renderNetlinkMegaClose('wrapper-' + gpt_id, slot, 0, _closeBtnPos);
      } else if (event.slot === slot && event.isEmpty) {
        // Xóa hoàn toàn container nếu không có quảng cáo
        var container = document.getElementById(containerId);
        if (container) container.remove();
      }
    });
  });
}

/**
 * NetlinkAdxMultiads: Định dạng quảng cáo thông minh tự động kích hoạt khi cuộn trang
 * @param {string} _adUnit - Mã đơn vị quảng cáo từ GAM
 * @param {number} _type - 0: In-content (Chèn giữa bài), 1: Overlay (Nổi giữa màn hình)
 * @param {number} _closeBtnPos - Vị trí nút đóng (0: trái, 1: phải, 2: giữa)
 */
function NetlinkAdxMultiads(_adUnit, _type = 0, _closeBtnPos = 1) {
    var isMobile = window.innerWidth < 768;
    var hasTriggered = false; // Đảm bảo chỉ chạy 1 lần khi đủ điều kiện cuộn

    // 1. Lắng nghe sự kiện cuộn trang
    window.addEventListener('scroll', function onScroll() {
        if (hasTriggered) return;

        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        var triggerThreshold = isMobile ? window.innerHeight : 400; // MB: 1 màn hình, PC: ~400px (2-3 lần lăn chuột)

        if (scrollPos >= triggerThreshold) {
            hasTriggered = true;
            initMultiads();
            window.removeEventListener('scroll', onScroll); // Gỡ bỏ listener để tối ưu hiệu năng
        }
    });

    function initMultiads() {
        checkGPTExists();
        var gpt_id = randomID();
        var containerId = 'nl-multi-container-' + gpt_id;

        // 2. Xác định vị trí chèn và cấu trúc HTML
        if (_type === 0) {
            // PHƯƠNG ÁN A: In-content (Tự động quét thẻ P hoặc Div nội dung)
            var contentArea = document.querySelector('article, .post-content, .entry-content, .content-detail') || document.body;
            var paragraphs = contentArea.querySelectorAll('p');
            
            var targetElement;
            if (paragraphs.length >= 4) {
                targetElement = paragraphs[Math.floor(paragraphs.length / 2)]; // Chèn vào giữa bài
            } else {
                targetElement = contentArea; // Nếu bài ngắn quá thì chèn vào cuối vùng content
            }

            var html = `<div id="${containerId}" style="margin: 20px auto; text-align: center; position: relative; width: 100%; clear: both;">
                            <div id="${gpt_id}" style="display: inline-block; min-height: 50px;"></div>
                        </div>`;
            targetElement.insertAdjacentHTML('afterend', html);

        } else {
            // PHƯƠNG ÁN B: Overlay (Nổi giữa màn hình)
            var html = `
                <div id="${containerId}" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2147483646; display: none; background: rgba(0,0,0,0.1); padding: 5px; border-radius: 8px;">
                    <div id="wrapper-${gpt_id}" style="position: relative; background: #fff; box-shadow: 0 0 30px rgba(0,0,0,0.5);">
                        <div id="${gpt_id}"></div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        // 3. Cấu hình GPT Mapping & Display
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(function() {
            var mapping = googletag.sizeMapping()
                .addSize([1024, 768], [['fluid'], [728, 90], [970, 250], [750, 250]]) // PC: Ưu tiên Fluid
                .addSize([0, 0], [[300, 250], [336, 280], [320, 100]]) // MB: Ưu tiên 300x250, 336x280
                .build();

            var adSlot = googletag.defineSlot(_adUnit, ['fluid', [728, 90], [970, 250], [300, 250], [336, 280]], gpt_id)
                .defineSizeMapping(mapping)
                .addService(googletag.pubads());

            googletag.enableServices();
            googletag.display(gpt_id);

            // 4. Lắng nghe sự kiện để hiện quảng cáo và gắn nút Close
            googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                if (event.slot === adSlot && !event.isEmpty) {
                    var container = document.getElementById(containerId);
                    if (container) container.style.display = 'block';

                    // Chỉ hiện nút Close nếu là định dạng Overlay (Type 1) 
                    // Hoặc hiện cả Type 0 nếu anh muốn người dùng có quyền tắt quảng cáo trong bài
                    var targetCloseId = (_type === 1) ? 'wrapper-' + gpt_id : containerId;
                    renderNetlinkMegaClose(targetCloseId, adSlot, 0, _closeBtnPos);
                } else if (event.slot === adSlot && event.isEmpty) {
                    var container = document.getElementById(containerId);
                    if (container) container.remove();
                }
            });
        });
    }
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
    var allSizes = [[300, 250], [336, 280], [300, 600], [300, 400], [320, 100]];
    
    var mapping = googletag.sizeMapping()
      .addSize([1024, 768], [[300, 600], [300, 400], [336, 280], [300, 250]]) // PC
      .addSize([0, 0], [[300, 250], [336, 280], [320, 100]]) // Mobile
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
 * NetlinkAdxFirstViewExt: Popup linh hoạt với logic kiểm soát hiển thị
 * @param {string} _adUnit - Mã đơn vị quảng cáo
 * @param {number} _isDisplay - Trạng thái hiển thị (Thường dùng với Cookie/LocalStorage)
 * @param {array} _pageView - Mảng cấu hình lượt xem trang [số lượt hiện tại, số lượt tối thiểu để hiện]
 * @param {number} _closeBtnPos - Vị trí nút đóng (0, 1, 2)
 */
function NetlinkAdxFirstViewExt(_adUnit, _isDisplay = 0, _pageView = [0], _closeBtnPos = 1) {
    // 1. Kiểm tra điều kiện hiển thị (Logic từ file gốc của anh)
    if (_isDisplay != 0) return;
    if (_pageView.length > 1 && _pageView[0] < _pageView[1]) return;

    checkGPTExists();
    var gpt_id = randomID();
    var containerId = 'nl-firstview-ext-container-' + gpt_id;

    // 2. Tạo giao diện Popup (Overlay)
    var html = `
        <div id="${containerId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483646; background: rgba(0,0,0,0.75); display: flex; justify-content: center; align-items: center;">
            <div id="wrapper-ext-${gpt_id}" style="position: relative; background: #fff; line-height: 0; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                <div id="${gpt_id}"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);

    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(function() {
        // 3. Khai báo tập hợp size linh hoạt (Multi-size)
        var allSizes = [[300, 600], [300, 250], [336, 280], [300, 400], [320, 100]];
        
        var mapping = googletag.sizeMapping()
            .addSize([1024, 768], [[300, 600], [300, 400], [336, 280], [300, 250]]) // Desktop
            .addSize([0, 0], [[300, 250], [336, 280], [320, 100]]) // Mobile
            .build();

        var slot = googletag.defineSlot(_adUnit, allSizes, gpt_id)
            .defineSizeMapping(mapping)
            .addService(googletag.pubads());

        googletag.enableServices();
        googletag.display(gpt_id);

        // 4. Lắng nghe sự kiện để gắn nút Close Mega dùng chung
        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            if (event.slot === slot && !event.isEmpty) {
                // Gọi hàm Close đã thống nhất (vPos=0 để nằm trên banner)
                renderNetlinkMegaClose('wrapper-ext-' + gpt_id, slot, 0, _closeBtnPos);
            } else if (event.slot === slot && event.isEmpty) {
                // Xóa container nếu không có quảng cáo trả về
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
  
  // 1. Tạo ID ngẫu nhiên cho slot
  var gpt_id = randomID();
  
  // 2. Tạo thẻ div chứa quảng cáo với kích thước mặc định từ file gốc
  var adDiv = document.createElement('div');
  adDiv.id = gpt_id;
  adDiv.style.textAlign = "center";
  
  // Giữ nguyên logic xử lý marginTop của anh
  if (_marginTop != -1) {
    adDiv.style.marginTop = _marginTop + "px";
  }

  // 3. Sử dụng currentScript để chèn đúng vị trí khách dán code
  var currentScript = document.currentScript;
  if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.insertBefore(adDiv, currentScript);
  } else {
      // Fallback cho trình duyệt cũ
      document.write('<div id="' + gpt_id + '" style="text-align:center;' + (_marginTop != -1 ? 'margin-top:' + _marginTop + 'px;' : '') + '"></div>');
  }

  // 4. Khởi tạo GPT với kích thước mặc định 300x600 như hàm gốc
  window.googletag = window.googletag || { cmd: [] };
  googletag.cmd.push(function() {
    // Khôi phục kích thước [300, 600] cố định như anh yêu cầu
    googletag.defineSlot(_adUnit, [300, 600], gpt_id).addService(googletag.pubads());
    
    googletag.enableServices();
    googletag.display(gpt_id);
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



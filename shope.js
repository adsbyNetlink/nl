// Tạo phần tử div chính
var divShopee = document.createElement("div");
divShopee.id = "divShopee";
divShopee.style.position = "fixed";
divShopee.style.right = "20px";
divShopee.style.top = "60%";
divShopee.style.zIndex = "999999";

divShopee.innerHTML = `<div
style="
  display: inline-block;
  overflow: hidden;
  text-align: right;
  padding: 3px;
  width: 100px;
  height: 100px;
"
>
<span
  id="hiddenBtn"
  style="
    cursor: pointer;
    user-select: none;
    line-height: 35px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: absolute;
    box-sizing: border-box;
    background: rgba(24, 24, 24, 0.57);
    height: 20px;
    width: 20px;
    top: 6px;
    right: 6px;
    border-radius: 20px;
  "
  ><svg
    viewBox="0 0 16 16"
    stroke="#EE4D2D"
    style="
      height: 10px;
      width: 10px;
      stroke: rgb(255 255 255);
      stroke-width: 2px;
    "
  >
    <path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path>
    <path stroke-linecap="round" d="M15,1L0.9,15.1"></path></svg
></span>
<div
  class="aanetwork-flyicon-355"
  style="width: 100%; border-radius: 0%; overflow: hidden; height: 100%"
>
  <a
    target="_blank"
    rel="noopener noreferrer nofollow"
    href="https://shope.ee/7zq67vaZgu"
    style="width: 100%; height: 100%"
    ><div
      style="
        background: url('https://media.adop.asia/uploads/2024/04/20/sansaleshopee-1713606118.png')
          0% 0% / contain no-repeat;
        width: 100%;
        height: 100%;
      "
    ></div
  ></a>
</div>
</div>`;
// Gắn divShopee vào body của trang web
document.body.appendChild(divShopee);

// Thêm sự kiện click cho hiddenBtn để xóa divShopee khi nhấp vào
hiddenBtn.addEventListener("click", function () {
  divShopee.remove();
});

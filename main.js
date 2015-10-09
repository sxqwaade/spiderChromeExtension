var msg = {
    title:$(".pro-detail h1").text(),
    price:$("#originalPrice").text(),
    discount_price:$("#kaluliPrice").text(),
    stock:$("#stock").text(),
    url:document.URL,
    sellad:$(".pro-detail .p2").text().replace(/\s/g,""),
    pic:$(".main-image img:eq(0)").attr("src")
};

chrome.runtime.sendMessage(msg);
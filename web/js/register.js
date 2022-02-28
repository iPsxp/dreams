// 检测手机号格式
function PhoneVerify(str){
    var reg = /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/;
    if (reg.test(str)) {
        alert("收款码错误, 请重新选择！")
        return true;
    }else{
        alert("收款码错误, 请重新选择！")
        return false;
    }
}

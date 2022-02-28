// 解析二维码
    $("body").append('<canvas id="qrcanvas" style="display:none;"></canvas>')
    $("#pictureChange").change(function (e) {
        var file = e.target.files[0];
        if(window.FileReader) {
            var fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onloadend = function(e) {
                var base64Data = e.target.result;
                base64ToqR(base64Data)
            }
        }
    })
    function base64ToqR(data) {
        var c = document.getElementById("qrcanvas");
        var ctx = c.getContext("2d");

        var img = new Image();
        img.src = data;
        img.onload = function() {
            $("#qrcanvas").attr("width",img.width)
            $("#qrcanvas").attr("height",img.height)
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if(code){
                // 判断是否为支付宝收款码域名
                if (code.data.indexOf("qr.alipay.com") != -1){
                    // 取出收款码秘钥
                    code.data = code.data.replace(/\?/, "/")
                    code.data = code.data.split("/")

                    // 检测收款码格式是否正确
                    if (ZfbVerify(code.data[3]) == true){

                        // 输出到输入框
                        document.getElementById("alipay").value=code.data[3];
                        document.getElementById("pictureChange").style="display:none;";

                    } else {
                        alert("收款码错误, 请重新选择！")

                    }


                } else {
                    alert("二维码错误, 请重新选择！")

                }

            }else{
                alert("识别错误, 请重新选择！")
            }
        };
    }
    function showCode(code){
        $("#result").append("<li>"+code+"</li>")
    }

    // 检测手机号格式
    function PhoneVerify(str){
        var reg = /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/;
        if (reg.test(str)) {
            return true;
        }else{
            return false;
        }
    }

    // 检测QQ格式
    function QQVerify(str){
        var reg = /^[1-9][0-9]{4,10}$/;
        if (reg.test(str)) {
            return true;
        }else{
            return false;
        }
    }

    // 检测邀请码格式
    function InviteVerify(str){
        var reg = /^[\w]{6}$/;
        if (reg.test(str)) {
            return true;
        }else{
            return false;
        }
    }

    // 检测姓名格式
    function NameVerify(str){
        var reg = /^[\u4E00-\u9FA5]{2,4}$/;
        if (reg.test(str)) {
            return true;
        }else{
            return false;
        }
    }

    // 检测收款码格式
    function ZfbVerify(str){
        var reg = /^[\w0-9]{22,25}$/;
        if (reg.test(str)) {
            return true;
        }else{
            return false;
        }

    }

    // 提交注册
    function register() {
        // 获取各项输入框内容
        qq = document.getElementById("qq").value;
        phone = document.getElementById("phone").value;
        Invite = document.getElementById("Invite").value;
        name = document.getElementById("name").value;
        alipay = document.getElementById("alipay").value;

        // 判断是否有空值
        if (qq != "" && phone != "" && Invite != "" && alipay != "" && name != ""){

            // 循环检测格输入框格式是否正确
            while (true){

                // 检测QQ格式是否正确
                if (QQVerify(qq) == false){
                    alert("QQ格式错误，请重新输入！")
                    break
                }

                // 判断手机号格式是否正确
                if (PhoneVerify(phone) == false){
                    alert("手机号格式错误，请重新输入！")
                    break
                }

                // 检测邀请码格式是否正确
                if (InviteVerify(Invite) == false){
                    alert("邀请码格式错误，请重新输入！")
                    break
                }

                // 检测姓名格式是否正确
                if (NameVerify(name) == false){
                    alert("姓名格式错误，请重新输入！")
                    break
                }

                // 请求注册
                document.getElementById("but").disabled="disabled"; // 禁止重复提交，按钮变黑

                get_register(qq, phone, Invite, name, alipay)


                break

            }


        } else {
            alert("部分输入框存未输入，请检查后重试！")

        }

    }

    // 获取get参数
    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.replace("%26", "&").split("&");

        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    // 请求注册
    function get_register(qq, phone, Invite, name, alipay) {
        $.ajax({
            type: "POST",
            url: "register.php",
            data: {"token": getQueryVariable("token"), "sign": getQueryVariable("sign"), "qq": qq, "phone": phone, "Invite": Invite, "name": name, "alipay": alipay},
            success: function(data){
                register_result(data);
            }
        });
    }

    // 注册结果
    function register_result(data) {
        data = JSON.parse(data);
        // 判断结果
        if (data["code"] == 1){ // 签名错误
            alert(data["msg"]);

        } else if (data["code"] == -1){ // 签名错误
            alert(data["msg"]);

        } else {
            alert(data["msg"]);

        }


    }

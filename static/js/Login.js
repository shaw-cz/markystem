
//注册
$().ready(function () {
    $('#loginText').click(function () {
        $('#regiText').attr("class",'')
        $('#loginText').attr("class",'large')
        $('#login').css("display",'inline')
        $('#register').css("display",'none')

    })
    $('#regiText').click(function () {
        $('#loginText').attr("class",'')
        $('#regiText').attr("class",'large')
        $('#login').css("display",'none')
        $('#register').css("display",'inline')

    })
    //注册
    $("#register").click(function () {
        var email = $("#email").val();
        var password = $("#password").val();
        $.ajax({
            type: "post",
            url: "http://10.8.28.164/api/auth/register",
            data: {email: email, password: password},
            dataType:"JSON",
            success: function (data) {
                var strs = data;
                console.log(strs);
                if (strs.code === 200) {
                    console.log('ok');
                    window.alert("注册成功")
                    location.href="index.html"
                } else if (strs.code === 201) {
                    console.log(strs.code);
                    alert("邮箱已被注册，请您直接登录");
                } else {
                    alert("服务器返回信息出错");
                }
            },
            error: function () {
                alert("验证失败,请检查您的网络设置或与管理人员联系");
            }
        });
    });
//layer

});

//登录
$().ready(function () {
    //
    $("#login").click(function () {
        var email = $("#email").val();
        var password = $("#password").val();
        $.ajax({
            type: "post",
            url: "http://10.8.28.164/api/auth/login",
            data: {email: email, password: password},
            dataType:"JSON",
            success: function (data) {
                var strs = data;
                console.log(strs);
                if (strs.code === 200) {
                    console.log('ok');
                    //将该用户的token储存在localStorage中
                    window.localStorage.setItem("token",strs.data.token);
                    //登录成功后跳转到主页mainPage
                    location.href="mainPage.html"
                } else if (strs.code === 201) {
                    console.log(strs.code);
                    alert("密码错误");
                }
                else if (strs.code === 202) {
                    console.log(strs.code);
                    alert("邮箱未注册");
                } else {
                    alert("服务器返回信息出错");
                }
            },
            error: function () {
                alert("验证失败,请检查您的网络设置或与管理人员联系");
            }
        });
    });
//layer

});
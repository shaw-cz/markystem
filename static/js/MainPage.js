$().ready(function () {
    let task_types = {
        "classify_text_radio": "文本单选任务",
        "classify_text_checkbox": "文本多选任务",
        "classify_image_radio": "图片单选任务",
        "classify_image_checkbox": "图片多选任务",
        "abstract": "文摘任务",
    }

    let task_type_urls = {
        "classify_text_radio": "radioText.html",
        "classify_text_checkbox": "checkboxText.html",
        "classify_image_radio": "radioImg.html",
        "classify_image_checkbox": "checkboxImg.html",
        "abstract": "setTexts.html",
    }


    //头部
    var a = 'b';
    $.ajax({
        headers: {
            'Authorization': "Bearer " + window.localStorage.getItem("token") //此处放置请求到的用户token
        },
        type: "get",
        url: "http://10.8.28.164/api/get_task",
        dataType: "JSON",
        success: function (data) {
            var strs = data;
            console.log(strs.code);
            for (var i = 0; i < strs.data.length; i++) {

                $("#createPro").append(
                    '<div class="col-12 col-md-4 col-xs-12 box" id="x" >' +
                    '<a href="#" class="thumbnail" id="a" >' +
                    '<div class="card mt-5">' +
                    '<h5 class="card-header text-center bg-primary text-white">' + strs.data[i].title +
                    '</h5>' +
                    '<div class="card-body">' +
                    '<ul class="list-group list-group-flush ">' +
                    '<li class="list-group-item">项目开始时间：<span class="createText">' + strs.data[i].start_time +
                    '</span></li>' +
                    '<li class="list-group-item">项目结束时间: <span class="createText">' + strs.data[i].end_time +
                    '</span></li>' +
                    '<li class="list-group-item">任务描述：<span class="createText"></span>' + strs.data[i].description +
                    '</li>' +
                    '<li class="list-group-item">已完成任务数量：<span class="createText"></span>' + strs.data[i].marked +
                    '</li>' +
                    '<li class="list-group-item">任务总量：<span class="createText"></span>' + strs.data[i].total +
                    '</li>' +
                    '<li class="list-group-item">任务类型：<span class="createText"></span>' + task_types[strs.data[i].task_type] +
                    '</li>' +
                    // '<li class="list-group-item">任务id：<span class="createText"></span>' + strs.data[i].id +
                    // '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    ' </a>' +
                    '</div>'
                )
                //根据项目类型不同跳转到不同页面
                let url = task_type_urls[strs.data[i].task_type];

                console.log(url);
                // $("#x.thumbnail").attr("href", url+"?id="+strs.data[i].id);
                var newUrl = encodeURI(url + "?id="+strs.data[i].id + "&title=" + strs.data[i].title)
                $("#a").attr("href", newUrl).attr("id", url + "?id=" + strs.data[i].id);
                //修改每一个的id
                $("#x").attr("id", strs.data[i].title);


            }
        },


        error: function () {
            alert("验证失败,请检查您的网络设置或与管理人员联系");
        }

    })


});



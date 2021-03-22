$().ready(function () {
    //获取来自主页的id
    let task_id = getQueryString("id");
    let task_title = decodeURI(getQueryString("title"));
    let url_submit_abstract = "http://10.8.28.164/api/submit_abstract/" + task_id
    let url_get_abstract = "http://10.8.28.164/api/get_abstract/" + task_id
    let authorization = "Bearer " + window.localStorage.getItem("token")

    console.log(task_title);
    $("#title").html(task_title)
    //通过页面传值方法
    function getQueryString(id) {
        let result = window.location.search.match(new RegExp("[\?\&]" + id + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }

    //将值填充到具体位置
    function fill_data(response) {
        $("#content").html(response.data.content)
        $("#abstract_text").val(response.data.abstract_text)
        $("#left_count").html(response.data.left_count)
        $("#marked_count").html(response.data.marked_count)
        $("#marked_index").html(response.data.marked_index)
    }

    function save_get_abstract(marked_index, to_index) {
        let abstract_text = $("#abstract_text").val();
        console.log(marked_index);
        console.log(abstract_text);
        if (abstract_text === '') {
            alert("文摘文本为空，请检查后再提交")
        } else {
            $.ajax({
                type: "post",
                headers: {
                    'Authorization': authorization
                },
                url: url_submit_abstract,
                data: {marked_index: marked_index, abstract_text: abstract_text},
                dataType: "JSON",
            }).then($.ajax({
                type: "post",
                headers: {
                    'Authorization': authorization
                },
                url: url_get_abstract,
                data: {marked_index: parseInt(to_index)},
                dataType: "JSON",
                success: function (response) {
                    fill_data(response)
                },
            }))
        }
    }

    function save_abstract(success) {
        let marked_index = $("#marked_index").text();
        let abstract_text = $("#abstract_text").val();

        if (abstract_text === '') {
            alert("文摘文本为空，请检查后再提交")
        } else {
            $.ajax({
                type: "post",
                headers: {
                    'Authorization': authorization
                },
                url: url_submit_abstract,
                data: {marked_index: marked_index, abstract_text: abstract_text},
                dataType: "JSON",
                success: success
            })
        }
    }


    $.ajax({
        type: "get",
        headers: {
            'Authorization': authorization //此处放置请求到的用户token
        },
        url: url_get_abstract,
        dataType: "JSON",
        success: function (response) {
            fill_data(response)
        },
        error: function () {
            alert("验证失败,请检查您的网络设置或与管理人员联系");
        }
    });


    //右键功能，先将已经输入的文本回传，再请求下一篇的文本
    $("#right").click(function () {
        let marked_index = $("#marked_index").text();
        save_get_abstract(marked_index, parseInt(marked_index) + 1);
    })

    //左键功能，先将本页值回传，再请求上页文本
    $("#left").click(function () {
        let marked_index = $("#marked_index").text();
        save_get_abstract(marked_index, parseInt(marked_index) - 1);
    })

    //跳转功能，先将本页值回传，再请求上页文本
    $("#jump").click(function () {
        let marked_jump = $("#jumpTo").val();
        let marked_index = $("#marked_index").text();
        let marked_count = $("#marked_count").text();
        if (parseInt(marked_jump) > 0 && parseInt(marked_jump) <= parseInt(marked_count)) {
            save_get_abstract(marked_index, parseInt(marked_jump));
        } else {
            alert("只能跳转到已标注过的页面")
        }
    })

    //暂时保存键，将本页的值回传
    $("#save").click(function () {
        save_abstract(function (response) {
            window.alert("保存成功")
            if (response.code === 200) {
                console.log('ok');
            } else {
                $("#content").html("任务索引出错");
            }
        })
    })

    $("#submit").click(function () {
        save_abstract(function (response) {
            window.alert("保存成功")
            if (response.code === 200) {
                console.log('ok');
                location.href = "mainPage.html"
            } else {
                $("#content").html("任务索引出错");
            }
        })
    })
});
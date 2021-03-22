//获取来自主页的id
let task_id = getQueryString("id");
let task_title = decodeURI(getQueryString("title"));
let url_submit_classify = "http://10.8.28.164/api/submit_classify/" + task_id
let url_get_classify = "http://10.8.28.164/api/get_classify/" + task_id
let url_get_category = "http://10.8.28.164/api/get_category/" + task_id
let authorization = "Bearer " + window.localStorage.getItem("token")

// console.log(task_id);

console.log(task_title);


//通过页面传值方法
function getQueryString(id) {

    let result = window.location.search.match(new RegExp("[\?\&]" + id + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

function fill_data(response) {
    //清空选中
    $('input:checkbox[name="checkbox"]').prop("checked", false);
    //将值填充到具体位置
    let marked_categories = response.data.marked_category;
    for (let i = 0; i < marked_categories.length; i++) {
        let category_value = marked_categories[i];
        $("input:checkbox[name='checkbox'][value='" + category_value + "']").prop("checked", true);
    }
    $("#content").html(response.data.content)
    $("#left_count").html(response.data.left_count)
    $("#marked_count").html(response.data.marked_count)
    $("#marked_index").html(response.data.marked_index)
}
//获取分类
function save_get_classify(marked_index, to_index) {
    let check_boxes = []
    $('input:checkbox[name="checkbox"]:checked').each(function () {
        console.log($(this).val())
        check_boxes.push($(this).val())
    });
    console.log(marked_index);
    if (check_boxes.length === 0) {
        alert("选项为空，请检查后再提交")
    } else {
        $.ajax({
            type: "post",
            headers: {
                'Authorization': authorization
            },
            url: url_submit_classify,
            data: {marked_index: marked_index, marked_category: check_boxes.join('`')},
            dataType: "JSON",
        }).then($.ajax({
            type: "post",
            headers: {
                'Authorization': authorization
            },
            url: url_get_classify,
            data: {marked_index: to_index},
            dataType: "JSON",
            success: function (response) {
                fill_data(response)
            },
        }))
    }
}

function save_classify(success) {
    let marked_index = $("#marked_index").text();

    let check_boxes = []
    $('input:checkbox[name="checkbox"]:checked').each(function () {
        check_boxes.push($(this).val())
    });
    console.log(marked_index);
    if (check_boxes.length === 0) {
        alert("选项为空，请检查后再提交")
    } else {
        $.ajax({
            type: "post",
            headers: {
                'Authorization': authorization
            },
            //task_id
            url: url_submit_classify,
            data: {
                marked_index: marked_index,
                marked_category: check_boxes.join('`')
            },

            dataType: "JSON",
            success: success
        })
    }
}

$().ready(function () {

    $("#title").html(task_title)
    $.ajax({
        type: "get",
        headers: {
            'Authorization': authorization
        },
        url: url_get_category,
        dataType: "JSON",
        success: function (response) {
            console.log(response)
            //将值填充到具体位置
            let categories = response.data
            for (let i = 0; i < categories.length; i++) {
                $("#addCheckbox").append(
                    '<label class="checkbox-inline col-md-3"><input type="checkbox" name="checkbox" id="newCheckbox">' + categories[i] +
                    '</label>'
                )
                $("#newCheckbox").val(categories[i]).attr("id", categories[i]);
            }
        },
        error: function () {
            alert("验证失败,请检查您的网络设置或与管理人员联系");
        }
    });

    $.ajax({
        type: "get",
        headers: {
            'Authorization': authorization
        },
        url: url_get_classify,
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
        save_get_classify(marked_index, parseInt(marked_index) + 1)
    })

    //左键功能，先将本页值回传，再请求上页文本
    $("#left").click(function () {
        let marked_index = $("#marked_index").text();
        save_get_classify(marked_index, parseInt(marked_index) - 1)
    })

    //跳转
    $("#jump").click(function () {
        let marked_jump = $("#jumpTo").val();
        let marked_index = $("#marked_index").text();
        let marked_count = $("#marked_count").text();

        console.log(marked_index);
        if (parseInt(marked_jump) <= 0 || parseInt(marked_jump) > parseInt(marked_count)) {
            alert("只能跳转到已标注页面");
        } else {
            save_get_classify(marked_index, parseInt(marked_jump))
        }
        marked_jump.val('');
    })

    //暂时保存键，将本页的值回传
    $("#save").click(function () {
            save_classify(function (response) {
                window.alert("保存成功")
                if (response.code === 200) {
                    console.log('ok');
                } else {
                    $("#content").html("任务索引出错");
                }
            })
        }
    )

    //完成任务
    $("#submit").click(function () {
            save_classify(function (response) {
                window.alert("保存成功")
                if (response.code === 200) {
                    location.href = "mainPage.html"
                } else {
                    $("#content").html("任务索引出错");
                }
            })
        }
    )
});


//layer
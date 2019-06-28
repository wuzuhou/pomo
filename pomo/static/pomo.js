
$(document).ready(function(){

  $(".settingbtn").click(function(){
    $(".settinglist").toggle();
  });

  // 点击settinglist和输入框以外的页面所有位置，它们都会被隐藏
  $("body").click(function(){
    let item = event.target;
    if (item.className != "settingbtn") {
      $(".settinglist").hide();
    }
    if (item.className != "taskinput") {
      $(".fa-level-down").hide();
    }
  })

  // 出现在中间位置的置顶的第一条土豆的打勾按钮被点击后，这个条目会被隐藏
  $(".fa-check").click(function(){
    $(".topbar").hide();
  });

  // 置顶按钮被点击后，置顶的第一条土豆会出现在中间位置
  $(".potatolist").on("click",".fa-arrow-up", function(){
    let text1 = $(this).parents("li").children("input").val();
    $(".topbar span").text(text1);
    $(".topbar").show();
  });

  // 定义一个函数，记录时间和宽度（data递减以及每间隔一秒调用这个函数交由下面使用它的主函数来定义）
  let width = "";
  let starttime = "";
  let endtime = "";
  let data = "";
  let id = document.getElementById("timemove");
  function countDown(widthmove) {
    let second = parseInt(data%60, 10);
    let minute = parseInt(data/60%60, 10);
    if(minute < 10) minute = "0" + minute;
    if(second < 10) second = "0" + second;
    $(".timeclock").css("background-color","#F2F4F4");
    $(".timeshow").text(minute + ":" + second);
    $(".titletime").text(minute + ":" + second + "-" + "番茄土豆");
    width += widthmove;
    id.style.width = width+'%';
  }

  // 开始番茄种并计时
  $(".startto").click(function(){
      $(".startto").hide();
      $(".timeclock").show();
      starttime = new Date();
      data = 3;
      width = 0.07;
      myVar =  setInterval(myTimer,1000);
      function myTimer(){
        data--;
        if (data > 00) {
          countDown(0.07);
        }

        else {
          let text2 = $(".potatolist ul li input").first().val();
          $(".task input").val(text2);
          $(".timeclock").hide();
          $(".task").show();
          $(".titletime").text("番茄土豆");
          $(".timeshow").text("");
          clearInterval(myVar);
        }
      };
  });

  $(".potatolist").on("click", "ul li", function(){
      console.log("ttttt");
      let text1 = $(this).children("input").val();
      let text2 = $(".task input").val();
      let text3 = text2 + " + " + text1;
      $(".task input").val(text3);
  });


  // 输入框被点击聚焦时，显示回车图标（不点击时默认是隐藏的）
  $(".task input").focus(function(){
      $(".task .fa-level-down").show();
  });

  $(".addtask input").focus(function(){
      $(".addtask .fa-level-down").show();
  });

  // 五分钟休息时钟
  // let myVar = "";
  function myTimer(){
    data--;
    if (data > 00) {
      countDown(0.33);
    }
    else {
      clearInterval(myVar);
      $(".startto").show();
      $(".timeclock").hide();
      $(".timeshow").text("");
      $(".titletime").text("番茄土豆");
    }
  };

  // 增加番茄记录到列表
  $("#recordsummit").click(function(){
      let tasknum = $(".recordlist li").length;
      let recordDate = new Date();
      let month = recordDate.getMonth() + 1;
      let day = recordDate.getDate();
      let hour = recordDate.getHours();
      let minute = recordDate.getMinutes();
      let taskdate = month.toString() + "月" + day.toString() + "日";
      let taskstarthour = starttime.getHours();
      let taskstartminute = starttime.getMinutes();
      if(taskstartminute < 10) taskstartminute = "0" + taskstartminute;
      if(taskstarthour < 10) taskstarthour = "0" + taskstarthour;
      if(hour < 10) hour = "0" + hour;
      if(minute < 10) minute = "0" + minute;
      let taskstart = taskstarthour.toString() + ":" + taskstartminute.toString();
      let taskend = hour.toString() + ":" + minute.toString();
      let tasktext = $(".taskinput").val();
      let dailyRecords = createDailyRecords(taskdate, taskstart, taskend, tasktext);
      // 如果输入框有值并且列表中没有一个记录
      if( $(".task input").val() && tasknum == 0){
          $(".norecord").hide();
          $(".fa-history").hide();
          $(".record").prepend(dailyRecords);
          $(".task").hide();
          $(".timeclock").show();
          data = 10;
          myVar =  setInterval(myTimer,1000);
        }
      // 如果输入框有值并且有记录
      if( $(".task input").val() && tasknum > 0) {
        // 如果列表中第一个记录的时间是当天时间，就插入第一个记录的前面
        if ( $(".record .recorddate").first().text() == taskdate ) {
          tasknum = $(".record ul:first").children().length + 1;
          let tasktotal = "完成了" + tasknum.toString() + "个番茄";
          $(".recordnum:first").text(tasktotal);
          let tasktext = $(".taskinput").val();
          $(".record ul:first").prepend("<li>" + "<span>" + taskstart  + " - " + taskend + "</span>" + tasktext + "</li>");
          $(".task").hide();
          $(".timeclock").show();
          data = 10;
          myVar =  setInterval(myTimer,1000);
        }
        // 如果列表中第一个记录的时间不是当天时间，就增加记录加上时间标题
        if ( $(".record .recorddate").first().text() != taskdate ) {
          $(".record").prepend(dailyRecords);
          $(".task").hide();
          $(".timeclock").show();
          data = 10;
          myVar =  setInterval(myTimer,1000);
        }
      }
  });

  // 增加番茄单条记录
  function createDailyRecords(taskdate, taskstart, taskend, tasktext){
    return "<div><div class='recordtitle'><div class='recorddate'>" +
      taskdate + "</div><div class='recordnum'>完成了1个番茄</div></div><ul class='recordlist'><li><span>" +
      taskstart  + " - " + taskend + "</span>" +
      tasktext + "</li></ul></div>"
  };

  $(".timecancel").click(function(){
    $(".cancelcheck").show();
    $(".layer").show();
  });

  $(".cancel").click(function(){
    $(".cancelcheck").hide();
    $(".layer").hide();
  });

  $(".confirm").click(function(){
    $(".cancelcheck").hide();
    $(".layer").hide();
    $(".timeclock").hide();
    $(".startto").show();
    $(".titletime").text("番茄土豆");
    $(".task").hide();
    clearInterval(myVar);
    $(".timeshow").text("");
    id.style.width = 0;
  });

  // 添加土豆单条任务
  function createTasks(task) {
    return "<li><span><i class='fa fa-circle-o' style='font-size: 120%; opacity: 1;' title='完成任务'></i></span><input value='" +
    task + "' type= 'text' disabled='disabled'> <span class='btns'>" +
    "<i class='fa fa-ellipsis-h' title='修改高级属性' ></i> " +
    "<i class='fa fa-pencil-square-o' title='编辑任务'></i> " +
    "<i class='fa fa-arrow-up' title='置顶任务' ></i></span></li>"
  };

  $("#tasksummit").click(function(){
    task = $(".addtask .taskinput").val();
    if (task) {
       addtask = createTasks(task);
       $(".potatolist ul").append(addtask);
       $(".addtask .taskinput").val("");
     };
  });

  // 绑定回车键给输入框
  $(".addtask .taskinput").on("keyup", function(event) {
    if (event.keyCode == "13") {
      $("#tasksummit").click();
    };
  });

  $(".task .taskinput").on("keyup", function(event) {
    if (event.keyCode == "13") {
      $("#recordsummit").click();
    }
  });

  // 编辑土豆
  $(".potatolist").on("click", ".fa-pencil-square-o", function(){
    if($(".fa-scissors").length >0) {
      return;
    };
    $(this).parents("li").children("input").removeAttr("disabled");
    $(this).parents("li").css("background-color","#FDEBD0");
    $(this).parents("li").children(".btns").prepend(
      '<i class="fa fa-check-square-o" style="margin-right:5px;" title="提交修改"></i>' +
      '<i class="fa fa-scissors" title="删除任务"></i>');
  });


  $(".potatolist").on("click", ".fa-check-square-o", function(){
    $(this).parents("li").children("input").attr("disabled","disabled");
    $(this).parents("li").css("background-color","white");
    $(this).siblings(".fa-scissors").remove();
    $(this).remove();
  });

  $(".potatolist").on("click", ".fa-scissors", function(){
    // remove之前取到本条土豆的值与topbar比对，如果相等，删除后要取得删除后的第一条土豆的值，并改写topbar
    let textdelect= $(this).parents("li").children("input").val();
    let texttopbar = $(".topbar span").text();
    $(this).parent().parent().remove();
    if(textdelect == texttopbar) {
      // remove之后取第一条土豆的值
      texttop = $(".potatolist ul li input").first().val();
      $(".topbar span").text(texttop);
    };
  })

});

Bmob.initialize("fc8725065ae9442ecf60f048b2b57058","a7c75bd62a6e7e1ec4b73d7f580aafb0");
BmobSocketIo.initialize("fc8725065ae9442ecf60f048b2b57058");
BmobSocketIo.updateTable("chatv2018");
BmobSocketIo.onUpdateTable=function(tablename,data){
  console.log("updata");
  if(tablename=="chatv2018"){
    var usr=data.usr?data.usr:"无名毛玉";
    var msg=data.msg;
    console.log(usr+":"+msg);
    prependMsg(usr,msg);
    pingdot();
  }
}
function prependMsg(usr,msg){
  $("#keri").prepend(
    $("<div>").attr("class","yo").prepend(
      $("<div>").attr("class","name").text(usr),
      $("<div>").attr("class","content").text(msg)
    )
  );
}
function sendMsg(usr,msg){
  var Chatv=Bmob.Object.extend("chatv2018");
  var line=new Chatv();
  line.set("usr",usr);
  line.set("msg",msg);
  line.save(null,{
    success:()=>console.log("send ok")
    ,error:()=>console.log("send failed")
  });
}
function getAll(){
  var Chatv=Bmob.Object.extend("chatv2018");
  var lines=new Bmob.Query(Chatv);
  lines.find({
    success:(re)=>{
      for(let i=0;i<re.length;i++){
        var usr=re[i].get("usr")?re[i].get("usr"):"无名毛玉";
        var msg=re[i].get("msg");
        console.log(usr+":"+msg);
        prependMsg(usr,msg);
        //document.querySelector("#lines").innerHTML+=line;
    }},
    error:()=>console.log("error")
    })
}
function pingdot(){
  $("#dot").css("background","red");
  setTimeout('$("#dot").css("background","#6cf")',2141);
}
window.getAll=()=>getAll();
window.onload=()=>{
  getAll();
  $("#kire .r").click(function(){
    sendMsg(
      $("#kire .l").val().toString(),
      $("#kire .c").val().toString()
    );
    $("#kire .c").val("");
  });
  reza2.init();
  $(window).resize(function(){
    reza2.resize();
  });
}

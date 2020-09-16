//模拟发送http请求
var request = require("request");
const { Http2ServerRequest } = require("http2");

function jQuery110204270924632448887_1599616117049(data){
    console.log(data.data)
}
//get请求
request('http://pv.sohu.com/cityjson?ie=utf-8', function (error, response, returnCitySN) {
    if (!error && response.statusCode == 200) {
        console.log(returnCitySN) // Show the HTML for the baidu homepage.


    //post请求
    request({
        url: `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=${returnCitySN['cip']}&co=&resource_id=6006&t=1599559036313&ie=utf8&oe=gbk&cb=op_aladdin_callback&format=json&tn=baidu&cb=jQuery1102025863569797570185_1599559001588&_=1599559001595`,
        method: "get",//如果是post就涉及到跨域的问题了
        json:false,
        // headers: {
        //     "content-type": "application/json",
        // },
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            body
            console.log(body);
            body.slice(4,body.length-1)
        }
    })

}
});
Http2ServerRequest.toString()
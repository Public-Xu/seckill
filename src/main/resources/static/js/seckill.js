/**
 * 模块化的JS，它是一种类似面向对象的设计思想
 * secKillObj 是一个Json对象，这个对象中可以拥有若干个属性，这些属性可以基本类型也可以是函数类型也可以是Json对象类型
 * url与fun就是2个属性他们分别都是Json对象类型
 * url是一个Json对象它的里面可以拥有若干个属性，这些属性可以基本类型或函数类型或Json对象类型，我们这里所有的属性全部都是
 *   函数类型，这些函数主要用于返回url请求地址路径，可以起到地址路径重用、
 * fun是一个Json对象它的里面可以拥有若干个属性，这些属性可以基本类型或函数类型或Json对象类型，我们这里所有的属性全部都是
 *   函数类型，这些函数主要用于完成秒杀的各个逻辑控制
 *
 */

var seckillObj = {
    url: {
        getSystemTime:function () {
            return "/getSystemTime";
        },
        getGoodsRandomNameById:function (goodsId) {
            return "/getGoodsRandomNameById?goodsId="+goodsId;
        },
        seckill:function (goodsId,randomName,buyPrice) {
            return "/seckill?goodsId="+goodsId+"&randomName="+randomName+"&buyPrice="+buyPrice;
        },
        getOrderResult:function (goodsId) {
            return "/getOrderResult?goodsId="+goodsId;
        }
    },
    fun: {
        /**
         * 秒杀的初始化方法，主要控制按钮的显示逻辑
         * @param goodsId 产品的Id
         * @param startTime 秒杀的开始时间
         * @param endTime 秒杀的结束时间
         */
        initSeckill:function (goodsId,startTime,endTime) {
            $.ajax({
                url:seckillObj.url.getSystemTime(),
                dataType:"json",
                type:"get",
                success:function (resp) {
                    if (resp.code==1){
                        var systemTime = resp.result;
                        if (systemTime<startTime){
                            seckillObj.fun.seckillCountdown(goodsId,startTime);
                            return false
                        } else if (systemTime>endTime){
                            $("#secKillButSpan").html("<span style='color:red;'>秒杀已经结束,请下次活动再来！</span>");
                            return false
                        } else {
                            seckillObj.fun.doSeckill(goodsId)
                        }
                    } else {
                        alert(resp.message)
                    }
                },
                error:function () {
                    alert("网络异常,请稍后重试!")
                }
            })
        },
        seckillCountdown:function (goodsId, startTime) {
            //使用jquery的倒计时插件实现倒计时
            /* + 1000 防止时间偏移 这个没有太多意义，因为我们并不知道客户端和服务器的时间偏移
            这个插件简单了解，实际项目不会以客户端时间作为倒计时的，所以我们在服务器端还需要验证*/
            var killTime = new Date(startTime + 1000);
            $("#secKillButSpan").countdown(killTime, function (event) {
                //时间格式
                var format = event.strftime('距秒杀开始还有: %D天 %H时 %M分 %S秒');
                $("#secKillButSpan").html("<span style='color:red;'>"+format+"</span>");
            }).on('finish.countdown', function () {
                //倒计时结束后回调事件，已经开始秒杀，用户可以进行秒杀了，有两种方式：
                //1、刷新当前页面
                //location.reload();//注意：这里reload方式万万不可取，由于时间设置都是同一点，重新reload会造成大量并发请求，增加服务器压力，这里最优选择第二种
                //或者2、调用秒杀开始的函数
                seckillObj.fun.doSeckill(goodsId);
            });
        },
        doSeckill:function (goodsId) {
            $("#secKillButSpan").html("<input type=\"button\" value=\"立即抢购\" id=\"buyBtn\">");
            $("#buyBtn").bind("click",function () {
                $(this).attr("disabled",true);
                $.ajax({
                    url:seckillObj.url.getGoodsRandomNameById(goodsId),
                    type:"get",
                    dataType:"json",
                    success:function (resp) {
                        if (resp.code==1){
                            var goodsRandomName = resp.result.randomName;
                            var buyPrice = resp.result.price;
                            seckillObj.fun.seckill(goodsId,goodsRandomName,buyPrice);
                        } else {
                            alert(resp.message)
                        }
                    },
                    error:function () {
                        alert("网络繁忙。。。")
                    }
                })
            });


        },
        seckill:function (goodsId,randomName,buyPrice) {
            $.ajax({
                url:seckillObj.url.seckill(goodsId,randomName,buyPrice),
                type:"get",
                dataType:"json",
                success:function (resp) {
                    if (resp.code==1){
                        alert(resp.message);
                        //下单成功，获取订单的状态，让客户进行支付
                        seckillObj.fun.getOrderResult(goodsId)
                    } else {
                        alert(resp.message)
                    }

                },
                error:function () {
                    alert("网络繁忙。。。")
                }
            })
        },
        getOrderResult:function (goodsId) {
            $.ajax({
                url:seckillObj.url.getOrderResult(goodsId),
                type:"get",
                dataType:"json",
                success:function (resp) {
                    if (resp.code==1){

                        $("#secKillButSpan").html("<span style=\"color: red\">下单成功：金额 "+resp.result.orderMoney+" 元，<a href=\"\">立即支付</a></span>")
                    } else {
                        //延迟指定的时间调用一次方法，参数一为要调用的方法，参数二为间隔的时间，单位为毫秒
                        window.setTimeout('seckillObj.fun.getOrderResult('+goodsId+')',3000)
                    }

                },
                error:function () {
                    alert("网络繁忙。。。")
                }
            })
        }
    }
};

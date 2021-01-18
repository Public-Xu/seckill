package com.seckill.service;

import com.seckill.commons.ReturnObject;
import com.seckill.model.Orders;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 许彤
 * 2020/12/29
 */
@FeignClient(name = "seckill-orders-service")
public interface OrdersService {

    @RequestMapping(value = "/getOrderResult")
    ReturnObject<Orders> getOrderResult(
            @RequestParam("goodsId") Integer goodsId,
            @RequestParam("uid") Integer uid);
}

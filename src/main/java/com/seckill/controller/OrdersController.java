package com.seckill.controller;

import com.seckill.commons.ReturnObject;
import com.seckill.model.Orders;
import com.seckill.service.OrdersService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * 许彤
 * 2020/12/29
 */
@Controller
public class OrdersController {
    @Resource
    private OrdersService ordersService;

    @RequestMapping(value = "/getOrderResult")
    @ResponseBody
    public Object getOrderResult(Integer goodsId){
        Integer uid = 1;
        ReturnObject<Orders> ro = ordersService.getOrderResult(goodsId,uid);
        return ro;
    }
}

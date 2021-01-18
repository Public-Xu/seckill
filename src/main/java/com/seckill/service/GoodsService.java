package com.seckill.service;

import com.seckill.commons.ReturnObject;
import com.seckill.model.Goods;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

/**
 * 许彤
 * 2020/12/26
 */
@FeignClient(name = "seckill-goods-service")
public interface GoodsService {

    @RequestMapping(value = "/queryAllGoodsList")
    List<Goods> queryAllGoodsList();

    @RequestMapping(value = "/queryGoodsElt")
    Goods queryGoodsElt(@RequestParam("id") Integer id);

    @RequestMapping(value = "/seckill")
    ReturnObject seckill(@RequestParam("goodsId")Integer goodsId,
                         @RequestParam("randomName")String randomName,
                         @RequestParam("uid")Integer uid,
                         @RequestParam("buyPrice")BigDecimal buyPrice);
}

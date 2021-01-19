package com.seckill.controller;

import com.seckill.commons.Constants;
import com.seckill.commons.ReturnObject;
import com.seckill.model.Goods;
import com.seckill.service.GoodsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.List;

/**
 * 许彤
 * 2020/12/26
 */
@Controller
public class GoodsController {
    @Resource
    private GoodsService goodsService;

    @RequestMapping(value = "/")
    public String goodsList(Model model){
        List<Goods> goodsList = goodsService.queryAllGoodsList();
        model.addAttribute("goodsList", goodsList);
        return "index";
    }

    @RequestMapping(value = "/showGoodsInfo")
    public String showGoodsInfo(Model model,Integer id){
        Goods goods = goodsService.queryGoodsElt(id);
        model.addAttribute("goods", goods);
        return "goodsInfo";
    }

    @RequestMapping(value = "/getSystemTime")
    @ResponseBody
    public Object getSystemTime(){
        ReturnObject<Long> ro = new ReturnObject<>();
        ro.setCode(Constants.OK);
        ro.setMessage("获取系统时间成功");
        ro.setResult(System.currentTimeMillis());
        return ro;
    }

    @RequestMapping(value = "/getGoodsRandomNameById")
    @ResponseBody
    public Object getGoodsRandomNameById(Integer goodsId){
        ReturnObject<Goods> ro = new ReturnObject<>();
        Goods goods = goodsService.queryGoodsElt(goodsId);
        long systemMillis = System.currentTimeMillis();
        if (goods == null){
            ro.setCode(Constants.ERROR);
            ro.setMessage("系统繁忙。。。");
            return ro;
        } else if (systemMillis<goods.getStartTime().getTime()){
            ro.setCode(Constants.ERROR);
            ro.setMessage("对不起，活动还未开始");
            return ro;
        } else if (systemMillis>goods.getEndTime().getTime()){
            ro.setCode(Constants.ERROR);
            ro.setMessage("对不起，活动已经结束");
            return ro;
        } else {
            ro.setCode(Constants.OK);
            ro.setResult(goods);
            return ro;
        }
    }

    @RequestMapping(value = "/seckill")
    @ResponseBody
    public Object seckill(Integer goodsId, String randomName, BigDecimal buyPrice){
        Integer uid = 1;
        ReturnObject ro = goodsService.seckill(goodsId,randomName,uid,buyPrice);
        return ro;
        //test
    }
}

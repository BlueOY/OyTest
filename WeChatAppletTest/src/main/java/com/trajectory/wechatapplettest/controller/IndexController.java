package com.trajectory.wechatapplettest.controller;

import com.alibaba.fastjson.JSON;
import com.trajectory.wechatapplettest.utils.StaticClass;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//证明是controller层并且返回页面
@Controller
public class IndexController {

    @ResponseBody   //返回数据不返回页面
    @RequestMapping("/")
    public String index() {
        return "Hello World!";
    }

    @ResponseBody
    @RequestMapping(value = "invokeCloudFunction")
    public String invokeCloudFunction(String functionName, String param) {
        System.out.println("functionName="+functionName);
        System.out.println("param="+param);

        if(StaticClass.access_token==null){
            // 如果access_token为空，则获取access_token
            StaticClass.getToken();
        }else if(StaticClass.expiresTime==null || StaticClass.expiresTime.before(new Date())){
            // 如果access_token过期，则获取access_token
            StaticClass.getToken();
        }
        // 访问云函数
        String res = StaticClass.testFunction(functionName, param);
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "test", method = RequestMethod.POST)
    public String test(@RequestBody Map<String, String> map) {
        System.out.println("param="+map);
        return "true";
    }

}

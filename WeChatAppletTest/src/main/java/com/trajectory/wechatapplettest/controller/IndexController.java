package com.trajectory.wechatapplettest.controller;

import com.alibaba.fastjson.JSON;
import com.trajectory.wechatapplettest.utils.StaticClass;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

//证明是controller层并且返回页面
@Controller
public class IndexController {

    @ResponseBody   //返回数据不返回页面
    @RequestMapping("/")
    public String home() {
        return "Hello World!";
    }

    @ResponseBody
    @RequestMapping(value = "invokeCloudFunction")
    public String invokeCloudFunction(Map<Object, Object> param, String functionName) {
        System.out.println("param="+param);

        if(StaticClass.access_token==null){
            // 如果access_token为空，则获取access_token
            StaticClass.getToken();
        }else if(StaticClass.expiresTime==null || StaticClass.expiresTime.before(new Date())){
            // 如果access_token过期，则获取access_token
            StaticClass.getToken();
        }
        // 访问云函数
        String POSTBODY = JSON.toJSONString(param);
        String res = StaticClass.testFunction(functionName, POSTBODY);
        return res;
    }

}

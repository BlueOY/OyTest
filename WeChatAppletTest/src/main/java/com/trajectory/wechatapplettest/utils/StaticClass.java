package com.trajectory.wechatapplettest.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class StaticClass {

    // token
    public static String access_token = null;
    // token过期时间
    public static Date expiresTime = null;

    public static void getToken(){
        String grant_type = "client_credential";
        String appid = "wxe1e761571d5c1aea";
        String secret = "e982a2d0d5da6a8d122c003578067c86";
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type="+grant_type+"&appid="+appid+"&secret="+secret;
        try {
            String res = HttpUtil.get(url);
            JSONObject jsonObject = JSON.parseObject(res);
            access_token = jsonObject.getString("access_token");
            int expires_in = jsonObject.getInteger("expires_in");
            Calendar c = Calendar.getInstance();
//            c.setTime(new Date());
            c.add(Calendar.SECOND, expires_in);
            expiresTime = c.getTime();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String testFunction(String function_name, String POSTBODY){
        String env = "ouyang-s2hbg";
        String url = "https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env="+env+"&name="+function_name+"&POSTBODY="+POSTBODY;
        try {
            return HttpUtil.post(url, POSTBODY);
        } catch (IOException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

}

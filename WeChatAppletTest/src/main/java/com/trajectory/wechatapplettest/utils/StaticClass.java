package com.trajectory.wechatapplettest.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import java.beans.Encoder;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

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

    public static String cloudFunction(String function_name, String POSTBODY){
        String env = "ouyang-s2hbg";
        String url = "https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env="+env+"&name="+function_name+"&POSTBODY="+POSTBODY;
        try {
            return HttpUtil.post(url, POSTBODY);
        } catch (IOException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    public static String getCloudFile(String fileid){
        String env = "ouyang-s2hbg";
        String url = "https://api.weixin.qq.com/tcb/batchdownloadfile?access_token="+access_token;
        Map<String, Object> params = new HashMap<String, Object>();
//        params.put("access_token", access_token);
        params.put("env", env);
        Map<String, Object> file = new HashMap<String, Object>();
        file.put("fileid", fileid);
        file.put("max_age", 7200);
        List<Object> file_list = new ArrayList<Object>();
        file_list.add(file);
        params.put("file_list", file_list);
        System.out.println(JSON.toJSONString(params));
        try {
            return HttpUtil.post(url, JSON.toJSONString(params));
        } catch (IOException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    public static Map<String, Object> putCloudFile(String path, File file){
        Map<String, Object> result = new HashMap<String, Object>();
        String env = "ouyang-s2hbg";
        String url = "https://api.weixin.qq.com/tcb/uploadfile?access_token="+access_token;
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("env", env);
        param.put("path", path);
        System.out.println("获取上传参数：url="+url);
        System.out.println("获取上传参数：param="+JSON.toJSONString(param));
        try {
            String resData = HttpUtil.post(url, JSON.toJSONString(param));
            System.out.println("获取上传参数：resData="+resData);
            Map<String, Object> resMap = JSON.parseObject(resData);
            if(resMap.get("errcode").toString().equals("0")){
                String resUrl = resMap.get("url").toString();
                String authorization = resMap.get("authorization").toString();
                String token = resMap.get("token").toString();
                String cos_file_id = resMap.get("cos_file_id").toString();
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("key", path);
                params.put("Signature", authorization);
                params.put("x-cos-security-token", token);
                params.put("x-cos-meta-fileid", cos_file_id);
                String res = UploadFile.upload(resUrl, params, file);
                System.out.println("上传图片到云存储：res="+res);
                Map<String, Object> temp = JSON.parseObject(res);
                if(temp!=null){
                    result.put("errcode", temp.get("errcode"));
                    result.put("errmsg", temp.get("errmsg"));
                }else{
                    result.put("errcode", 0);
                }
                result.put("file_id", resMap.get("file_id"));
                return result;
            }else{
                result.put("errcode", resMap.get("errcode"));
                result.put("errmsg", resMap.get("errmsg"));
                return result;
            }
        } catch (IOException e) {
            e.printStackTrace();
            result.put("errcode", "error");
            result.put("errmsg", e.getMessage());
            return result;
        }
    }

}

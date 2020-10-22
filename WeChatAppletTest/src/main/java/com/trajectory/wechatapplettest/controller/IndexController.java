package com.trajectory.wechatapplettest.controller;

import com.alibaba.fastjson.JSON;
import com.trajectory.wechatapplettest.utils.PinYinUtil;
import com.trajectory.wechatapplettest.utils.StaticClass;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
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

        // 获取token
        if(StaticClass.access_token==null){
            // 如果access_token为空，则获取access_token
            StaticClass.getToken();
        }else if(StaticClass.expiresTime==null || StaticClass.expiresTime.before(new Date())){
            // 如果access_token过期，则重新获取access_token
            StaticClass.getToken();
        }
        // 访问云函数
        String res = StaticClass.cloudFunction(functionName, param);
        System.out.println("访问云函数：res="+res);
        Map<String, Object> map = JSON.parseObject(res);
        if(map.get("errcode").toString().equals("40001")){
            // 如果返回错误，则重新获取access_token
            StaticClass.getToken();
            // 访问云函数
            res = StaticClass.cloudFunction(functionName, param);
            System.out.println("第二次访问云函数：res="+res);
        }else if(map.get("errcode").equals("0")){
            // 说明调用成功
            return res;
        }
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "getCloudFile")
    public String getCloudFile(String fileid) {
        // 获取token
        if(StaticClass.access_token==null){
            // 如果access_token为空，则获取access_token
            StaticClass.getToken();
        }else if(StaticClass.expiresTime==null || StaticClass.expiresTime.before(new Date())){
            // 如果access_token过期，则重新获取access_token
            StaticClass.getToken();
        }
        // 获取云文件
        String res = StaticClass.getCloudFile(fileid);
        Map<String, Object> map = JSON.parseObject(res);
        if(map.get("errcode").equals("40001")){
            // 如果返回错误，则重新获取access_token
            StaticClass.getToken();
            // 获取云文件
            res = StaticClass.getCloudFile(fileid);
        }else if(map.get("errcode").equals("0")){
            // 说明调用成功
            return res;
        }
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "uploadCloudFile")
    public Map<String, Object> uploadCloudFile(MultipartFile file, String type) {
        //获取原文件名称
        String originalFilename = file.getOriginalFilename();
        System.out.println("上传文件的Controller：originalFilename="+originalFilename);
        originalFilename = PinYinUtil.getFullSpell(originalFilename);
        System.out.println("上传文件的Controller：originalFilename="+originalFilename);
//        String fileSuffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        //生成新文件名称
        SimpleDateFormat formatter= new SimpleDateFormat("yyyyMMddHHmmssSSSz");
        Date date = new Date(System.currentTimeMillis());
        String newName = formatter.format(date) + originalFilename;
        try {
            newName = URLEncoder.encode(newName,"utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        //读取文件数据
        File dir =new File("uploadImageTemp/");
        //如果文件夹不存在则创建
        if  (!dir.exists() && !dir.isDirectory()) {
            System.out.println("文件夹不存在");
            dir .mkdir();
        }
        File newFile = new File("uploadImageTemp/"+file.getOriginalFilename());
        try {
            FileOutputStream output = new FileOutputStream(newFile);
            output.write(file.getBytes());
            output.close();
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("errcode", "error");
            result.put("errmsg", e.getMessage());
            return result;
        }
        if(StaticClass.access_token==null){
            // 如果access_token为空，则获取access_token
            StaticClass.getToken();
        }else if(StaticClass.expiresTime==null || StaticClass.expiresTime.before(new Date())){
            // 如果access_token过期，则获取access_token
            StaticClass.getToken();
        }

        // 提交云文件
        String path = type+"/"+newName;
        Map<String, Object> res = StaticClass.putCloudFile(path, newFile);
        System.out.println("Concroller：uploadCloudFile：res="+JSON.toJSONString(res));

//        res.put("path", path);
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "test", method = RequestMethod.POST)
    public String test(@RequestBody Map<String, String> map) {
        System.out.println("param="+map);
        return "true";
    }

    @ResponseBody
    @RequestMapping(value = "testCharset")
    public String testCharset(String param) {
        System.out.println("param="+param);
        return param;
    }

}

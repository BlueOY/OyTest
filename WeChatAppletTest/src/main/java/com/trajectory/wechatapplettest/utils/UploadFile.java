package com.trajectory.wechatapplettest.utils;

import org.apache.http.*;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.*;
import java.nio.charset.Charset;
import java.util.Map;

public class UploadFile {

    public static String upload(String url, Map<String, Object> params, File file) {
        String res = "";
        CloseableHttpClient httpClient = null;
        CloseableHttpResponse response = null;
        try {
            httpClient = HttpClients.createDefault();

            // 把一个普通参数和文件上传给下面这个地址 是一个servlet
            HttpPost httpPost = new HttpPost(url);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.setContentType(ContentType.MULTIPART_FORM_DATA);

            // 相当于<input type="file" name="file"/>
            // 把文件转换成流对象FileBody
            FileBody fileBody = new FileBody(file, ContentType.MULTIPART_FORM_DATA);
//            builder.addPart("file", fileBody);
            // 相当于<input type="text" name="userName" value=userName>
//            for(Map.Entry<String, Object> entry:params.entrySet()){
////                StringBody stringBody = new StringBody(entry.getValue().toString(), ContentType.create("text/plain", Consts.UTF_8));
//                StringBody stringBody = new StringBody(entry.getValue().toString(), ContentType.MULTIPART_FORM_DATA);
//                builder.addPart(entry.getKey(), stringBody);
//            }
            builder.addPart("key", new StringBody(params.get("key").toString(), ContentType.MULTIPART_FORM_DATA));
            builder.addPart("Signature", new StringBody(params.get("Signature").toString(), ContentType.MULTIPART_FORM_DATA));
            builder.addPart("x-cos-security-token", new StringBody(params.get("x-cos-security-token").toString(), ContentType.MULTIPART_FORM_DATA));
            builder.addPart("x-cos-meta-fileid", new StringBody(params.get("x-cos-meta-fileid").toString(), ContentType.MULTIPART_FORM_DATA));
            builder.addPart("file", fileBody);

            HttpEntity reqEntity = builder.build();
            httpPost.setEntity(reqEntity);

            // 发起请求 并返回请求的响应
            response = httpClient.execute(httpPost);

//            System.out.println("The response value of token:" + response.getFirstHeader("token"));

            // 获取响应对象
            HttpEntity resEntity = response.getEntity();
            if (resEntity != null) {
                // 打印响应长度
//                System.out.println("Response content length: " + resEntity.getContentLength());
                // 打印响应内容
                res = EntityUtils.toString(resEntity, Charset.forName("UTF-8"));
//                System.out.println(res);
            }

            // 销毁
            EntityUtils.consume(resEntity);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (response != null) {
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                if (httpClient != null) {
                    httpClient.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            return res;
        }
    }

}

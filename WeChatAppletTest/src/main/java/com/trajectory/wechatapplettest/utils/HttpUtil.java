package com.trajectory.wechatapplettest.utils;

import java.io.*;
import java.net.*;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HttpUtil {

	private static final int CONNECTION_TIMEOUT_INT=5*1000;		//设置connection连接超时的时间
	private static final int READ_TIMEOUT_INT=5*1000;		//设置读取返回值的超时的时间
	//线程池
	private static ExecutorService executor = Executors.newCachedThreadPool();
	//设置sessionId
	public static String sessionId;

	public static void getFromUrl(final String url, final HttpEventListener listener){
		System.out.println("HttpUtils："+"GET访问url="+url);
		//用这个会完成后马上结束
		new UrlGetThread(url,listener).start();
		// 用这个完成后不会马上结束
//		executor.execute(new UrlGetThread(url,listener));
	}


	public static void postFromUrl(final String url, final Map<String,String> param, final HttpEventListener listener){
		System.out.println("HttpUtils："+"POST访问url="+url);
		System.out.println("HttpUtils："+"POST访问param="+param);
		try {
			//用这个会完成后马上结束
			new UrlPostThread(url,param,listener).start();
			// 用这个完成后不会马上结束
//			executor.execute(new UrlPostThread(url,param,listener));
		} catch (UnsupportedEncodingException e) {
			listener.httpEvent(-1, e.getMessage());
			e.printStackTrace();
		}
	}
	public static void postFromUrl(final String url, final String param, final HttpEventListener listener){
		System.out.println("HttpUtils："+"POST访问url="+url);
		System.out.println("HttpUtils："+"POST访问param="+param);
		//用这个会完成后马上结束
		new UrlPostThread(url,param,listener).start();
		// 用这个完成后不会马上结束
//		executor.execute(new UrlPostThread(url,param,listener));
	}

	public interface HttpEventListener{
		public void httpEvent(int state, String result);
	}

	private static class UrlPostThread extends Thread{
		String url;
		String param;
		HttpEventListener listener;
		public UrlPostThread(String url, Map<String,String> param, HttpEventListener listener) throws UnsupportedEncodingException {
			this.url=url;
			String paramStr = "";
			int i=0;
			for(Map.Entry<String, String> entry:param.entrySet()){
				paramStr=paramStr+entry.getKey()+"="+URLEncoder.encode(entry.getValue(),"utf-8");
				i++;
				if(i<param.size()){
					paramStr=paramStr+"&";
				}
			}
			this.param=paramStr;
			this.listener=listener;
		}
		public UrlPostThread(String url, String param, HttpEventListener listener) {
			this.url=url;
			this.param=param;
			this.listener=listener;
		}

		@Override
		public void run() {
			try {
				String res = post(url, param);
				listener.httpEvent(0, res);
			} catch (MalformedURLException e) {
				listener.httpEvent(-1, e.getMessage());
				e.printStackTrace();
			} catch (IOException e) {
//				Toast.makeText(context, text, duration)  这个是在手机屏幕上显示的黑色框
				listener.httpEvent(-1, e.getMessage());
				e.printStackTrace();
			}

		}
	}
	public static String post(String url, Map<String,String> param) throws IOException {
		String paramStr = "";
		int i=0;
		for(Map.Entry<String, String> entry:param.entrySet()){
			paramStr=paramStr+entry.getKey()+"="+URLEncoder.encode(entry.getValue(),"utf-8");
			i++;
			if(i<param.size()){
				paramStr=paramStr+"&";
			}
		}
		return post(url, paramStr);
	}
	public static String post(String url, String param) throws IOException {
		URL tempurl=new URL(url);
		HttpURLConnection urlConn=(HttpURLConnection) tempurl.openConnection();
		if(null!=sessionId && !"".equals(sessionId)){
			urlConn.setRequestProperty("cookie", sessionId);
		}
		urlConn.setDoInput(true);
		urlConn.setDoOutput(true);//使用直接流
		urlConn.setRequestMethod("POST");
		urlConn.setUseCaches(false);//缓存
		urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");//设置meta参数
		urlConn.setRequestProperty("Charset", "utf-8");
		urlConn.setConnectTimeout(CONNECTION_TIMEOUT_INT);
		urlConn.setReadTimeout(READ_TIMEOUT_INT);
		urlConn.connect();
		DataOutputStream dos=new DataOutputStream(urlConn.getOutputStream());
		dos.writeBytes(param);
		dos.flush();
		dos.close();
		// 获取sessionid. （getHeaderField必须写在参数被服务器读取之后）
		String cookieval = urlConn.getHeaderField("set-cookie");
		if(cookieval != null) {
			String sId = cookieval.substring(0, cookieval.indexOf(";"));
			if(sId!=null && !sId.equals(sessionId)){
				sessionId = sId;
			}
		}
		InputStreamReader in=new InputStreamReader(urlConn.getInputStream());
		BufferedReader buf=new BufferedReader(in);
		String resolut="";
		String readLine=null;

		while((readLine=buf.readLine())!=null){
			resolut+=readLine;
		}
		in.close();
		urlConn.disconnect();

		return resolut;
	}
	private static class UrlGetThread extends Thread{
		String url;
		HttpEventListener listener;
		public UrlGetThread(String url, HttpEventListener listener) {
			this.url=url;
			this.listener=listener;
		}

		@Override
		public void run() {
			System.out.println("UrlGetThread："+"开始调用线程");
			try {
				String res = get(url);
				listener.httpEvent(0, res);
			}catch(MalformedURLException e) {
				listener.httpEvent(-1, "MalformedURLException");
				e.printStackTrace();
			}catch(SocketTimeoutException e){
				listener.httpEvent(-1, "网络连接超时，请检查网络连接状态");
				e.printStackTrace();
			}catch(ConnectException e){
				listener.httpEvent(-1, "无法连接到网络，请检查网络连接状态");
				e.printStackTrace();
			}catch(FileNotFoundException e){
				listener.httpEvent(-1, "FileNotFoundException");
				e.printStackTrace();
			}catch(IOException e){
				listener.httpEvent(-1, e.getMessage());
				e.printStackTrace();
			}
		}
	}
	public static String get(String url) throws IOException {
		URL tempurl=new URL(url);
		HttpURLConnection urlConn=(HttpURLConnection) tempurl.openConnection();
		if(null!=sessionId && !"".equals(sessionId)){
			urlConn.setRequestProperty("cookie", sessionId);
		}
		// 获取sessionid.
		String cookieval = urlConn.getHeaderField("set-cookie");
		if(cookieval != null) {
			String sId = cookieval.substring(0, cookieval.indexOf(";"));
			if(sId!=null && !sId.equals(sessionId)){
				sessionId = sId;
			}
		}
		urlConn.setConnectTimeout(CONNECTION_TIMEOUT_INT);		//设置连接超时
		urlConn.setReadTimeout(READ_TIMEOUT_INT);			//设置读取超时
		InputStreamReader in = new InputStreamReader(urlConn.getInputStream());
		BufferedReader buf = new BufferedReader(in);
		String resolut="";
		String readLine=null;
		while((readLine=buf.readLine())!=null){
			resolut+=readLine;
		}
		in.close();
		urlConn.disconnect();
		return resolut;
	}

}

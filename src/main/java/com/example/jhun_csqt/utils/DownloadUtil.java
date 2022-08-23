package com.example.jhun_csqt.utils;

import com.alibaba.fastjson.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.*;

public class DownloadUtil {

//    /**
//     * 根据文件所在路径下载文件
//     *
//     * @param request
//     * @param response
//     * @param filePath 文件路径
//     */
//    public static void download(HttpServletRequest request, HttpServletResponse response, String filePath) {
//        // 创建文件
//        File file = new File(ROOT + filePath);
//        // 取得文件名
//        String fileName = file.getName();
//        InputStream fis = null;
//        try {
//            fis = new FileInputStream(file);
//            request.setCharacterEncoding("UTF-8");
//            String agent = request.getHeader("User-Agent").toUpperCase();
//            if ((agent.indexOf("MSIE") > 0) || ((agent.indexOf("RV") != -1) && (agent.indexOf("FIREFOX") == -1)))
//                fileName = URLEncoder.encode(fileName, "UTF-8");
//            else {
//                fileName = new String(fileName.getBytes("UTF-8"), "ISO8859-1");
//            }
//            response.reset();
//            response.setCharacterEncoding("UTF-8");
//            response.setContentType("application/force-download"); // 设置强制下载不打开
//            response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
//            response.setHeader("Content-Length", String.valueOf(file.length()));
//
//            int capacity = 1024;
//            byte[] b = new byte[capacity];
//            int len;
//            while ((len = fis.read(b)) != -1) {
//                response.getOutputStream().write(b, 0, len);
//            }
//            response.flushBuffer();
//            fis.close();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }

    /**
     * 根据指定URL将文件下载到指定目标位置
     *
     * @param request
     * @param response
     * @param fileName 文件数据（包含文件名和文件路径）
     */
    public static void downloadFile(HttpServletRequest request, HttpServletResponse response, JSONObject fileName) {
        try {
            // 统一资源
            URL url = new URL((String)fileName.get("urlPath"));
            // 获取文件名
            String realName = (String)fileName.get("realName");
            // 连接类的父类，抽象类
            URLConnection urlConnection = url.openConnection();
            // http的连接类
            HttpURLConnection httpURLConnection = (HttpURLConnection) urlConnection;
            //设置超时
            httpURLConnection.setConnectTimeout(5 * 1000);
            //设置请求方式，默认是GET
//            httpURLConnection.setRequestMethod("POST");
            // 设置字符编码
            httpURLConnection.setRequestProperty("Charset", "UTF-8");
            // 打开到此 URL引用的资源的通信链接（如果尚未建立这样的连接）。
            httpURLConnection.connect();
            // 文件大小
            int fileLength = httpURLConnection.getContentLength();
            // 建立链接从请求中获取数据
//            URLConnection con = url.openConnection();
            BufferedInputStream bin = new BufferedInputStream(httpURLConnection.getInputStream());

            request.setCharacterEncoding("UTF-8");
            String agent = request.getHeader("User-Agent").toUpperCase();
            if ((agent.indexOf("MSIE") > 0) || ((agent.indexOf("RV") != -1) && (agent.indexOf("FIREFOX") == -1)))
                realName = URLEncoder.encode(realName, "UTF-8");
            else {
                realName = new String(realName.getBytes("UTF-8"), "ISO8859-1");
            }
            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/force-download"); // 设置强制下载不打开
            response.addHeader("Content-Disposition", "attachment;filename=" + realName);
            response.setHeader("Content-Length", String.valueOf(fileLength));

            // 设置单次接收的数据量
            int capacity = 2048;
            int size = 0;
            // 设置单次接收数据的字节数组
            byte[] bytes = new byte[capacity];
            while ((size = bin.read(bytes)) != -1) {
                response.getOutputStream().write(bytes, 0, size);
            }
            // 关闭资源
            response.flushBuffer();
            bin.close();
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.err.println("文件下载失败！");
        } finally {
        }
    }
}

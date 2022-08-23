package com.example.jhun_csqt.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.utils.Conversion.Metric;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UploadUtil {
    public static List<UploadFile> getUploadFiles(MultipartHttpServletRequest multipartHttpServletRequest) {
        List<MultipartFile> files = multipartHttpServletRequest.getFiles("files");
        List<UploadFile> fileList = new ArrayList();
        for (MultipartFile file : files) {
            // 定义一个StringBuilder，用于拼接字符串
            StringBuilder stringBuilder = new StringBuilder();
            // 定义一个JSONObject对象，用于存储文件内容
            JSONObject jsonObject = new JSONObject();
            // 取得上传文件
            String fileName = file.getOriginalFilename();
            Long fileSize = file.getSize();
            if (fileName != null && !fileName.equals("")) {
                try {

                    // 转成字符流
                    InputStream inputStream = file.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
                    BufferedReader br = new BufferedReader(reader);
                    // 循环逐行读取
                    while (br.ready()) {
                        String tmp = br.readLine();
                        stringBuilder.append(tmp + "\n");
                    }
                    // 获取并存储文件内容
                    jsonObject.put("fileContent", stringBuilder.toString());
                    // 关闭流
                    br.close();
                    reader.close();
                    inputStream.close();
                    // 创建文件要保存的路径
                    /*File uploadFile = new File(Path);
                    if (!uploadFile.exists() || uploadFile == null) {
                        uploadFile.mkdirs();
                    }*/
                    // 获取文件类型
                    String fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
                    // 生成一个随机id
                    /*String id = UUID.randomUUID().toString();
                    String targetName = fileName;
                    // 文件真实存放路径
                    String filePath = uploadFile.getPath() + File.separator
                            + targetName;
                    // 保存文件
                    file.transferTo(new File(filePath));*/
                    // 初始化上传文件
                    String fileSizeStr = Metric.fromBConvert(fileSize);
                    UploadFile upfile = new UploadFile(fileName, fileType, fileSizeStr, JSONObject.toJSONString(jsonObject));
                    // 添加文件
                    fileList.add(upfile);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return fileList;
    }

    /**
     * 文件编码随机生成器
     *
     * @param num 编码长度
     * @return
     */
    public static String randomRangeCode(int num) {
        String result = "";
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (int i = 0; i < num; i++) {
            long j = Math.round(Math.random() * (str.length() - 1));
            int index = new Long(j).intValue();
            result += str.substring(index, index + 1);
        }
        return result;
    }

    public static List<Object> getFiles(MultipartFile[] files, String webFilesPath) {
        List<Object> objects = null;
        JSONArray fileList;
        // 文件名与编码的散列表
        Map<String, String> getCodeByName;
        if(files != null && files.length > 0) {
            // 初始化文件集
            fileList = new JSONArray();
            // 初始化散列表
            getCodeByName = new HashMap<>();
            for (MultipartFile file : files) {
                // 定义一个JSONObject对象，用于存储文件
                JSONObject pdfFileJson = new JSONObject();
                // pdf文件名
                String fileName = file.getOriginalFilename();
                // 文件类型
                String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
                // 文件大小
                String fileSize = Metric.fromBConvert(file.getSize());
                // 随机生成一个文件编码（10位）
                String fileCode = randomRangeCode(10);
                String filePath = webFilesPath + fileCode + "." + fileType;

                if (fileName != null && !fileName.isEmpty()) {
                    // 包装文件对象
                    pdfFileJson.put("fileName", fileName);
                    pdfFileJson.put("fileType", fileType);
                    pdfFileJson.put("fileSize", fileSize);
                    pdfFileJson.put("filePath", filePath);
                    // 添加文件
                    fileList.add(pdfFileJson);
                    // 添加映射
                    getCodeByName.put(fileName, fileCode);
                }
            }
            // 封装在一个集合中
            objects = new ArrayList<>();
            // 添加元素
            objects.add(fileList);
            objects.add(getCodeByName);
        }
        return objects;
    }

    public static boolean saveFilesToServer(MultipartFile[] files, Map<String, String> getCodeByName, String fileROOTPath, String secondPath) {
        if(files == null || files.length == 0) {
            System.out.println("文件不存在！无法保存到指定路径~~~");
            return false;
        }
        for (MultipartFile file : files) {
            // 文件名
            String fileName = file.getOriginalFilename();
            // 文件类型
            String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
            String fileCode;
            if(getCodeByName == null || getCodeByName.size() == 0) {
                System.out.println("文件不存在！无法保存到指定路径~~~");
                return false;
            }
            // 文件编号
            fileCode = getCodeByName.get(fileName);
            if (fileType != null && !fileType.isEmpty() && fileCode != null) {
                try {
                    // 保存文件的路径
                    String saveFilePath = fileROOTPath + secondPath + fileCode + "." + fileType;
                    // 创建要保存在服务器的文件
                    File pdf_file = new File(saveFilePath);
                    File parentFile = new File(saveFilePath).getParentFile();
                    File grandParentFile = new File(saveFilePath).getParentFile().getParentFile();
                    // 父目录不存在则创建（两级目录）
                    if(!grandParentFile.exists() || grandParentFile == null) {
                        grandParentFile.mkdir();
                    } else if(!parentFile.exists() || parentFile == null) {
                        parentFile.mkdir();
                    } else {
                        if (!pdf_file.exists() || pdf_file == null) {
                            pdf_file.createNewFile();
                        } else {
                            // 存在则删除旧文件
                            pdf_file.delete();
                        }
                    }
                    // 在指定路径下写入文件
                    file.transferTo(Paths.get(pdf_file.getPath()));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("保存文件异常，请稍后再试！");
                    return false;
                }
            }
        }
        return true;
    }

    // 生成一个随机id
    /*String id = UUID.randomUUID().toString();
    // 保存文件
    file.transferTo(new File(filePath));*/
    /*-------------------- 读取pdf文件的内容 --------------------*//*
    // 转成字符流
    InputStream inputStream = file.getInputStream();
    InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
    BufferedReader bufferedReader = new BufferedReader(reader);
    // 循环逐行读取
                        while (bufferedReader.ready()) {
        String tmp = bufferedReader.readLine();
        bufferedWriter.write(tmp);
    }
    // 关闭流
                        bufferedReader.close();
                        reader.close();
                        inputStream.close();
    *//*-------------------- 读取pdf文件的内容 --------------------*//*
    *//*-------------------- 保存文件到指定的服务器路径 --------------------*//*
    // 创建要保存在服务器的文件
    File pdf_file = new File(filePath);
    File parentFile = new File(filePath).getParentFile();
    // 父目录不存在则创建
                        if(!parentFile.exists() || parentFile == null) {
        parentFile.mkdir();
    } else {
        if (!pdf_file.exists() || pdf_file == null) {
            pdf_file.createNewFile();
        }
    }
    FileOutputStream fileOutputStream = new FileOutputStream(pdf_file);
    OutputStreamWriter writer= new OutputStreamWriter(fileOutputStream, "UTF-8");
    BufferedWriter bufferedWriter = new BufferedWriter(writer);
    // 关闭流
                        bufferedWriter.close();
                        writer.close();
                        fileOutputStream.close();
    *//*-------------------- 保存文件到指定的服务器路径 --------------------*/
}

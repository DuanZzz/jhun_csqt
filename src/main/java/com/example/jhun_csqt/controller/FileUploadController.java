package com.example.jhun_csqt.controller;

import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.entity.Query.FileQuery;
import com.example.jhun_csqt.service.FileService;
import com.example.jhun_csqt.utils.Response;
import com.example.jhun_csqt.utils.UploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("Files")
public class FileUploadController {
    @Autowired
    private FileService fileService;

    /**
     *
     * @Title: uploadFile
     * @Description: TODO(上传附件)
     * @param request
     * @param response
     */
    @RequestMapping("uploadFile")
    public Response uploadFj(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
        List<UploadFile> fileList = UploadUtil.getUploadFiles(multiRequest);
        // 保存数据集文件至数据库
        for(int i = 0; i < fileList.size(); i++){
            // 获取文件
            UploadFile  file = fileList.get(i);
            // 获取数据集文件名
            String fileName = file.getFileName();
            // 实例化一个文件查询条件
            FileQuery fileQuery = new FileQuery(fileName);
            // 查询数据集文件列表
            List<UploadFile> list = fileService.listFile(fileQuery);
            if(list.size() > 0) {
                // 覆盖数据集文件
                fileService.UpdateFile(file);
                continue;
            }
            fileService.InsertFile(fileList.get(i));
        }
        response.setContentType("text/xml;charset=UTF-8");
        Response resultResponse;
        try {
            /*for (UploadFile file : fileList) {
                System.err.println(file);
            }*/
            resultResponse = new Response(1, "success", fileList);
        } catch (Exception e) {
            e.printStackTrace();
            resultResponse = new Response(0, "failure", null);
        }
        return resultResponse;
    }

    /**
     *
     * @Title: 文件列表查询
     * @Description: TODO(查询文件列表)
     */
    @RequestMapping(value = "selectFileList", method = { RequestMethod.POST })
    public List selectFiles() {
        // 实例化一个空白查询条件
        FileQuery fileQuery = new FileQuery();
        // 查询数据集文件列表
        List<UploadFile> fileList = fileService.listFile(fileQuery);
        // 定义文件名列表
        List<String> fileNames = new ArrayList<>();
        for(UploadFile file : fileList){
            fileNames.add(file.getFileName());
        }
        return fileNames;
    }
}

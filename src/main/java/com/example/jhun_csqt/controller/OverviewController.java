package com.example.jhun_csqt.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.Common.PageDTO.Page;
import com.example.jhun_csqt.entity.Overview.AlgOverview;
import com.example.jhun_csqt.entity.Query.AlgOverviewQuery;
import com.example.jhun_csqt.service.AlgOverviewService;
import com.example.jhun_csqt.utils.Page.page;
import com.example.jhun_csqt.utils.Response;
import com.example.jhun_csqt.utils.UploadUtil;
import com.example.jhun_csqt.utils.serverFiles.fileOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("Algorithms")
public class OverviewController {
    @Autowired
    private AlgOverviewService algOverviewService;

    @RequestMapping(value = "addOverview", method = {RequestMethod.POST})
    public Response addOverview(HttpServletRequest request, @RequestParam(value = "notFiles", required = false) String notFileData,
                                        @RequestParam(value = "image", required = false) MultipartFile[] images,
                                        @RequestParam(value = "pdfFile", required = false) MultipartFile[] pdfFiles) {
        /*------------------------ 接收参数的前端FormData参数的第二种写法 ------------------------*/
        /*MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
        String notFileData = multipartHttpServletRequest.getParameter("notFiles");
        MultipartFile[] images = multipartHttpServletRequest.getFiles("image");
        MultipartFile[] pdfFiles = multipartHttpServletRequest.getFiles("pdfFile");*/
        /*------------------------ 接收参数的前端FormData参数的第二种写法 ------------------------*/

        // 上传的文件保存的根路径（D:\Apache Software Foundation\Tomcat8.5\webapps\files）
        String fileROOTPath = request.getServletContext().getRealPath("");
        // 重写fileROOTPath（将文件保存在webapps文件夹的files文件夹下）
        fileROOTPath = fileROOTPath.replaceAll("\\\\ROOT\\\\", "");
        // 实际加载图片文件的路径
        String webFilesPath = "/upload/files/";
        // 转换成JSON对象
        JSONObject notFiles = JSON.parseObject(notFileData);
        // 获取非文件数据
        String title = notFiles.getString("title");
        String authorAndInstitution = notFiles.getString("authorAndInstitution");
        String publicDate = notFiles.getString("publicDate");
        String gradeAndName = notFiles.getString("gradeAndName");
        String wordDesc = notFiles.getString("wordDesc");
        JSONObject wordDesc_jsonObj= null;
        // 文字描述的json对象.
        if(wordDesc != null && !wordDesc.isEmpty()) {
            wordDesc_jsonObj = new JSONObject();
            wordDesc_jsonObj.put("wordDesc", wordDesc);
        } else {
            System.out.println("算法的文字描述未上传。");
        }
        // 获取图片数据
        List<Object> image_obj = UploadUtil.getFiles(images, webFilesPath);
        JSONArray image_jsonArr = null;
        Map<String, String> img_getCodeByName = null;
        if(image_obj != null && image_obj.size() > 0) {
            image_jsonArr = (JSONArray) image_obj.get(0);
            img_getCodeByName = (Map<String, String>) image_obj.get(1);
        }
        // 获取pdf文件数据
        List<Object> pdfFile_obj = UploadUtil.getFiles(pdfFiles, webFilesPath);
        JSONArray pdfFile_jsonArr = null;
        Map<String, String> pdf_getCodeByName = null;
        if(pdfFile_obj != null && pdfFile_obj.size() > 0) {
            pdfFile_jsonArr = (JSONArray) pdfFile_obj.get(0);
            pdf_getCodeByName = (Map<String, String>) pdfFile_obj.get(1);
        }
        // 新增算法概述后返回的一个结果
        Response resultResponse;
        if((title == null || title.isEmpty()) || (authorAndInstitution == null || authorAndInstitution.isEmpty()) ||
                (publicDate == null || publicDate.isEmpty()) || (gradeAndName == null || gradeAndName.isEmpty()) ||
                (pdfFile_jsonArr == null || pdfFile_jsonArr.size() == 0)) {
            System.out.println("重要信息未填写完！");
            resultResponse = new Response(0, "existEmpty", null);
        } else {
            // 首先检查数据库中是否已经存在该算法概述
            AlgOverviewQuery algOverviewQuery = new AlgOverviewQuery(title);
            List<AlgOverview> algOverviewList = algOverviewService.listOverview(algOverviewQuery);
            if((algOverviewList.size() > 0)) {
                System.out.println("当前算法概述已存在！");
                resultResponse = new Response(0, "alreadyExist", null);
            } else {
                // 封装一个算法概述对象
                AlgOverview algOverview = new AlgOverview(title, authorAndInstitution, publicDate, gradeAndName,
                        JSONObject.toJSONString(wordDesc_jsonObj), JSONObject.toJSONString(image_jsonArr), JSONObject.toJSONString(pdfFile_jsonArr));
                // 保存图片和pdf文件到指定路径
                // 判断上传的图片是否保存成功
                boolean img_save_status = false;
                // 判断上传的pdf文件是否保存成功
                boolean pdf_save_status = false;
                // 文件保存的二级目录
                String secondPath = "\\files\\";
                if(images == null) {
                    System.out.println("图片文件未上传。");
                } else {
                    img_save_status = UploadUtil.saveFilesToServer(images, img_getCodeByName, fileROOTPath, secondPath);
                }
                if(pdfFiles == null) {
                    System.out.println("pdf文件未上传。");
                } else {
                    pdf_save_status = UploadUtil.saveFilesToServer(pdfFiles, pdf_getCodeByName, fileROOTPath, secondPath);
                }
                // 增加完成后返回的概述对象
                AlgOverview tmpAlgOverview;
                if(images != null && images.length > 0) {
                    if(img_save_status && pdf_save_status) {
                        // 图片和pdf文件全部保存服务器成功后才能将数据保存至数据库
                        algOverviewService.insertOverview(algOverview);
                    }
                } else {
                    if(pdf_save_status) {
                        // 图片为空，但pdf上传至服务器成功后将数据保存至数据库
                        algOverviewService.insertOverview(algOverview);
                    }
                }
                // 获取添加到数据库中的算法概述
                List<AlgOverview> results = algOverviewService.listOverview(new AlgOverviewQuery(title));
                if(results.size() > 0) {
                    tmpAlgOverview = results.get(0);
                    resultResponse = new Response(1, "addSuccess", tmpAlgOverview);
                } else {
                    resultResponse = new Response(0, "saveFileError", null);
                }
            }
        }
        return resultResponse;
    }

    /**
     * 根据id删除算法概述
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "deleteOverview", method = { RequestMethod.POST })
    public Response deleteOverview(HttpServletRequest request) {
        // 获取服务器中文件所在的路径
        String fileROOTPath = request.getServletContext().getRealPath("");
        // 重写fileROOTPath（文件保存在webapps文件夹的files文件夹下）
        fileROOTPath = fileROOTPath.replaceAll("\\\\ROOT\\\\", "") + "\\files";
        // 接收前端传来的id数组
        JSONArray jsonArray = (JSONArray) JSONArray.parse(request.getParameter("idArray"));
        // 根据id查找匹配的算法概述中包含的文件集合的名字（以删除服务器下的文件，边找边删除数据库的数据）
        Map<String, Integer> fileNames = new HashMap<>();
        for (int i = 0; i < jsonArray.size(); i++) {
            Integer id = Integer.parseInt(jsonArray.getString(i));
            List<AlgOverview> list = algOverviewService.listOverview(new AlgOverviewQuery(id, null));
            if(list != null && list.size() > 0) {
                AlgOverview algOverview = list.get(0);
                if(algOverview != null && !algOverview.equals("")) {
                    // 获取图片文件名
                    String images_jsonStr = algOverview.getImages();
                    JSONArray image_arrays = (JSONArray) JSONArray.parse(images_jsonStr);
                    if(image_arrays != null && image_arrays.size() > 0) {
                        for (int j = 0; j < image_arrays.size(); j++) {
                            JSONObject jsonObject = (JSONObject) image_arrays.get(j);
                            String filePath = jsonObject.getString("filePath");
                            String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                            fileNames.put(fileName, 1);
                        }
                    }
                    // 获取pdf文件名
                    String pdfFiles_jsonStr = algOverview.getPdfFiles();
                    JSONArray pdfFile_arrays = (JSONArray) JSONArray.parse(pdfFiles_jsonStr);
                    if(pdfFile_arrays != null && pdfFile_arrays.size() > 0) {
                        for (int j = 0; j < pdfFile_arrays.size(); j++) {
                            JSONObject jsonObject = (JSONObject) pdfFile_arrays.get(j);
                            String filePath = jsonObject.getString("filePath");
                            if(filePath != null && !filePath.isEmpty()) {
                                String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                                fileNames.put(fileName, 1);
                            }
                        }
                    }
                }
            }
            // 删除数据库中的数据
            algOverviewService.deleteOverview(new AlgOverviewQuery(id, null));
        }
        // 删除服务器中的文件数据（webapps文件夹的files文件夹下的文件）
        File file = new File(fileROOTPath); // 输入要删除文件目录的绝对路径
        boolean flag = fileOperations.deleteFile(file, fileNames);
        if(flag) {
            System.out.println("文件删除成功！");
        }
        return new Response(1, "success", null);
    }

    @RequestMapping(value = "listPageOverview", method = {RequestMethod.POST})
    public Response listPageOverview(HttpServletRequest request) {
        // 获取当前页
        long currentPage = Long.parseLong(request.getParameter("currentPage"));
        // 获取maxPageSize
        long maxPageSize = Long.parseLong(request.getParameter("maxPageSize"));
        // 获取数据库中的全部算法概述数据
        List<AlgOverview> allAlgOverview = algOverviewService.listOverview(new AlgOverviewQuery());
//        System.out.println("allAlgOverview-->" + allAlgOverview)
        // 设置总条数
        long total = allAlgOverview.size();
        // 获取页面数
        long pages = page.getPages(total, maxPageSize);
        if(currentPage > pages) {
            return new Response(0, "noData", pages);
        }
        // 获取每页条数
        long pageSize = page.getPageSize(currentPage, total, maxPageSize);
        Page page = null;
        if(pageSize != 0) {
//            System.out.println("currentPage-->" + currentPage);
//            System.out.println("pageSize-->" + pageSize);
            // 获取每页数据
            List<AlgOverview> records = new ArrayList<>();
            int startIndex = (int) ((currentPage - 1) * maxPageSize);
            int endIndex = (int) ((currentPage - 1) * maxPageSize + pageSize);
            // 设置数据
            for (int i = startIndex; i < endIndex; i++) {
                records.add(allAlgOverview.get(i));
            }
            page = new Page(records, currentPage, pageSize, total, pages);
        }
        return new Response(1, "success", page);
    }

    /**
     * 根据标题来搜索算法概述（根据标题模糊搜索）
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "searchOverview", method = { RequestMethod.POST })
    public Response searchOverview(HttpServletRequest request) {
        // 搜索结果
        List<AlgOverview> algOverviewList;
        // 封装结果
        Response response;
        // 算法标题
        String alg_title = request.getParameter("title");
        if(alg_title != null && !alg_title.isEmpty()) {
            algOverviewList = algOverviewService.searchOverview(new AlgOverviewQuery(alg_title));
            if(algOverviewList == null || algOverviewList.isEmpty()) {
                response = new Response(0, "noResult", algOverviewList);
            } else {
                response = new Response(1, "success", algOverviewList);
            }
        } else {
            response = new Response(0, "titleIsEmpty", null);
        }
        return response;
    }

    @RequestMapping(value = "updateOverview", method = {RequestMethod.POST})
    public Response updateOverview(HttpServletRequest request, @RequestParam(value = "notFiles", required = false) String notFileData,
                                @RequestParam(value = "image", required = false) MultipartFile[] images,
                                @RequestParam(value = "pdfFile", required = false) MultipartFile[] pdfFiles) {
        // 修改文件的根路径（D:\Apache Software Foundation\Tomcat8.5\webapps\files）
        String fileROOTPath = request.getServletContext().getRealPath("");
        // 重写fileROOTPath（将文件保存在webapps文件夹的files文件夹下）
        fileROOTPath = fileROOTPath.replaceAll("\\\\ROOT\\\\", "");
        // 网络请求的虚拟路径
        String webFilesPath = "/upload/files/";
        // 转换成JSON对象
        JSONObject notFiles = JSON.parseObject(notFileData);
        // 获取非文件数据
        String title = notFiles.getString("title"); // 一定不能为空（前后端都得做限制）
        String authorAndInstitution = notFiles.getString("authorAndInstitution");
        if((authorAndInstitution == null || authorAndInstitution.isEmpty())) {
            authorAndInstitution = "empty";
        }
        String publicDate = notFiles.getString("publicDate");
        if((publicDate == null || publicDate.isEmpty())) {
            publicDate = "empty";
        }
        String gradeAndName = notFiles.getString("gradeAndName");
        if((gradeAndName == null || gradeAndName.isEmpty())) {
            gradeAndName = "empty";
        }
        String wordDesc = notFiles.getString("wordDesc");
        JSONObject wordDesc_jsonObj = null;
        // 文字描述的json对象.
        if (wordDesc != null && !wordDesc.isEmpty()) {
            wordDesc_jsonObj = new JSONObject();
            wordDesc_jsonObj.put("wordDesc", wordDesc);
        } else {
            System.out.println("算法的文字描述未上传。");
        }
        // 获取图片数据
        List<Object> image_obj = UploadUtil.getFiles(images, webFilesPath);
        JSONArray image_jsonArr = null;
        Map<String, String> img_getCodeByName = null;
        if (image_obj != null && image_obj.size() > 0) {
            image_jsonArr = (JSONArray) image_obj.get(0);
            img_getCodeByName = (Map<String, String>) image_obj.get(1);
        }
        // 获取pdf文件数据
        List<Object> pdfFile_obj = UploadUtil.getFiles(pdfFiles, webFilesPath);
        JSONArray pdfFile_jsonArr = null;
        Map<String, String> pdf_getCodeByName = null;
        if (pdfFile_obj != null && pdfFile_obj.size() > 0) {
            pdfFile_jsonArr = (JSONArray) pdfFile_obj.get(0);
            pdf_getCodeByName = (Map<String, String>) pdfFile_obj.get(1);
        }
        if(pdfFile_obj == null || pdfFile_jsonArr == null) {
            JSONArray array = new JSONArray();
            JSONObject tmp = new JSONObject();
            tmp.put("state", "pdfEmpty");
            array.add(tmp);
            pdfFile_jsonArr = array;
        }

        if((title == null || title.isEmpty())) {
            System.out.println("标题不能为空！");
            return new Response(0, "titleIsEmpty", null);
        }
        if((authorAndInstitution == null || authorAndInstitution.isEmpty()) &&
                (publicDate == null || publicDate.isEmpty()) && (gradeAndName == null || gradeAndName.isEmpty())) {
            System.out.println("请至少再选一项信息进行修改！");
            return new Response(0, "noEnd", null);
        }

        List<AlgOverview> algOverviewList = algOverviewService.listOverview(new AlgOverviewQuery(title));
        // 根据title查找匹配的算法概述中包含的文件集合的名字（以替换服务器下的文件，边找边修改数据库的数据）
        Map<String, Integer> fileNames = new HashMap<>();
        if(algOverviewList != null && algOverviewList.size() > 0) {
            AlgOverview algOverview = algOverviewList.get(0);
            if(algOverview != null && !algOverview.equals("")) {
                // 获取图片文件名
                String images_jsonStr = algOverview.getImages();
                JSONArray image_arrays = (JSONArray) JSONArray.parse(images_jsonStr);
                if(image_arrays != null && image_arrays.size() > 0) {
                    for (int j = 0; j < image_arrays.size(); j++) {
                        JSONObject jsonObject = (JSONObject) image_arrays.get(j);
                        String filePath = jsonObject.getString("filePath");
                        String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                        fileNames.put(fileName, 1);
                    }
                }
                // 获取pdf文件名
                String pdfFiles_jsonStr = algOverview.getPdfFiles();
                JSONArray pdfFile_arrays = (JSONArray) JSONArray.parse(pdfFiles_jsonStr);
                if(pdfFile_arrays != null && pdfFile_arrays.size() > 0) {
                    for (int j = 0; j < pdfFile_arrays.size(); j++) {
                        JSONObject jsonObject = (JSONObject) pdfFile_arrays.get(j);
                        String filePath = jsonObject.getString("filePath");
                        if(filePath != null && !filePath.isEmpty()) {
                            String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                            fileNames.put(fileName, 1);
                        }
                    }
                }
            }
        } else {
            return new Response(0, "overviewIsNotExist", null);
        }

        // 封装一个算法概述对象
        AlgOverview algOverview = new AlgOverview(algOverviewList.get(0).getId(), title, authorAndInstitution, publicDate, gradeAndName,
                JSONObject.toJSONString(wordDesc_jsonObj), JSONObject.toJSONString(image_jsonArr), JSONObject.toJSONString(pdfFile_jsonArr));
        // 修改数据库中的数据
        algOverviewService.updateOverview(algOverview);
        // 判断上传的图片是否保存成功
        boolean img_save_status = false;
        // 判断上传的pdf文件是否保存成功
        boolean pdf_save_status = false;
        // 如果服务器下的文件存在，则删除后再增加（否则直接添加）
        if(fileNames.size() > 0) {
            // 删除服务器中的文件数据（webapps文件夹的files文件夹下的文件）
            File file = new File(fileROOTPath + "\\files");
            boolean flag = fileOperations.deleteFile(file, fileNames);
            if(!flag) {
                return new Response(0, "delFileFail", null);
            }
        }
        // 将新文件保存在相同的路径下
        // 文件保存的二级目录
        String secondPath = "\\files\\";
        if(images == null || images.length == 0) {
            System.out.println("图片文件未上传。");
        } else {
            img_save_status = UploadUtil.saveFilesToServer(images, img_getCodeByName, fileROOTPath, secondPath);
        }
        if(pdfFiles == null || pdfFiles.length == 0) {
            System.out.println("pdf文件未上传。");
        } else {
            pdf_save_status = UploadUtil.saveFilesToServer(pdfFiles, pdf_getCodeByName, fileROOTPath, secondPath);
        }
        if(images != null && images.length > 0) {
            if(pdfFiles == null || pdfFiles.length == 0) {
                if(img_save_status) {
                    return new Response(1, "success", algOverview);
                } else {
                    return new Response(0, "saveFileFail", null);
                }
            } else {
                if(img_save_status && pdf_save_status) {
                    return new Response(1, "success", algOverview);
                } else {
                    return new Response(0, "saveFileFail", null);
                }
            }
        } else {
            if(pdfFiles != null && pdfFiles.length > 0) {
                if(pdf_save_status) {
                    return new Response(1, "success", algOverview);
                } else {
                    return new Response(0, "saveFileFail", null);
                }
            } else {
                return new Response(1, "success", algOverview);
            }
        }
    }
}

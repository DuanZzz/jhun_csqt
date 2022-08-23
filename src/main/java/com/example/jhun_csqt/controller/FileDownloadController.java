package com.example.jhun_csqt.controller;

import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.utils.DownloadUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("File")
public class FileDownloadController {
//    /**
//     * pdf预览文件根路径
//     */
//    private static String previewFileROOT = ".\\src\\main\\resources\\static\\pdf\\Thesis";
//
//    /**
//     * 文件路径数组 (数组中的第一个元素【下标为0】的文件路径为ktruss算法论文的路径，其他的算法以此类推)
//     */
//    private static String[] files_path = { "\\k-truss\\" +
//            "2017_A会_PVLDB_Truss-based Community Search：a Truss-equivalence Based Indexing Approach.pdf"
//    };

    /**
     * url路径
     */
    private static String urlROOTPath;

    /**
     * 通过下载工具类来下载pdf文件
     *
     * @param request
     * @param response
     */
    @RequestMapping(value = "download")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response) {
        // 获取路径
        JSONObject fileData = JSONObject.parseObject(request.getParameter("fileData"));
        // 初始化urlROOTPath
        urlROOTPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String filePath = fileData.getString("filePath");
        // 获取文件名
        String realName = fileData.getString("realName");
        if((filePath != null && !filePath.equals("undefined") && !filePath.isEmpty()) &&
                (realName != null && !realName.equals("undefined") && !realName.isEmpty())) {
            // 拼接urlPath
            String urlPath = urlROOTPath + filePath;
            // 清空JSON对象
            fileData.clear();
            // 重新赋值
            fileData.put("realName", realName);
            fileData.put("urlPath", urlPath);
            // 调用下载工具类
            DownloadUtil.downloadFile(request, response, fileData);
        }
    }

    /**
     * 通过文件流的方式预览 PDF 文件
     *
     * @param request
     * @param response
     */
//    @RequestMapping(value = "preview")
//    public void pdfStreamHandeler(HttpServletRequest request, HttpServletResponse response) {
//        // 获取名字
//        int index = Integer.parseInt(request.getParameter("flag"));
//        File file = new File(previewFileROOT + files_path[index]);
//        byte[] data = null;
//        try {
//            // 编辑请求头部信息
//            // 解决请求头跨域问题（IE兼容性 也可使用该方法）
//            response.setHeader("Access-Control-Allow-Origin", "*");
//            response.setContentType("application/pdf");
//            FileInputStream input = new FileInputStream(file);
//            data = new byte[input.available()];
//            input.read(data);
//            response.getOutputStream().write(data);
//            input.close();
//        } catch (Exception e) {
//            System.err.println("读取pdf文件异常~");
//        }
//    }
}

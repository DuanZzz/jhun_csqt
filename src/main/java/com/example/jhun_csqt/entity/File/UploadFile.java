package com.example.jhun_csqt.entity.File;

import lombok.Data;

/**
 * 上传文件实体类
 *
 * @author wyh
 * @date 2021/9/23
 */
@Data
public class UploadFile {
    /**
     * 文件名
     */
    private String fileName;

    /**
     * 文件类型
     */
    private String fileType;

    /**
     * 文件大小
     */
    private String fileSize;

    /**
     * 文件内容
     */
    private String fileContent;

    /**
     * 无参构造函数
     */
    public UploadFile() { }

    public UploadFile(String fileName, String fileType,
                      String fileSize, String fileContent) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.fileContent = fileContent;
    }

    @Override
    public String toString() {
        return "UploadFile{" +
                "fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileSize='" + fileSize + '\'' +
                '}';
    }
}


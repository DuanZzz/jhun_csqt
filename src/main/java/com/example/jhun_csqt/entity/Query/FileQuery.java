package com.example.jhun_csqt.entity.Query;

import lombok.Data;

/**
 * 文件查询实体类
 *
 * @author wyh
 * @date 2021/9/24
 */
@Data
public class FileQuery {
    /**
     * 文件名
     */
    private String fileName;
    /**
     * 文件类型
     */
    private String fileType;

    public FileQuery() {  }

    public FileQuery(String fileName) {
        this.fileName = fileName;
    }

    public FileQuery(String fileName, String fileType) {
        this.fileName = fileName;
        this.fileType = fileType;
    }
}

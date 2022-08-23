package com.example.jhun_csqt.mapper;

import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.entity.Query.FileQuery;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FileMapper {
    /*查询数据集文件列表*/
    List<UploadFile> listFile(FileQuery fileQuery);

    /*将数据集文件保存在数据库中*/
    int InsertFile(UploadFile file);

    /*修改数据集文件内容和大小*/
    void UpdateFile(UploadFile file);
}

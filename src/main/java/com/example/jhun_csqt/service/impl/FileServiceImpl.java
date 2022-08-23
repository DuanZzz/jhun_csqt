package com.example.jhun_csqt.service.impl;

import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.entity.Query.FileQuery;
import com.example.jhun_csqt.mapper.FileMapper;
import com.example.jhun_csqt.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileServiceImpl implements FileService {
    @Autowired
    private FileMapper fileMapper;

    @Override
    public List<UploadFile> listFile(FileQuery fileQuery) { return fileMapper.listFile(fileQuery); }

    @Override
    public int InsertFile(UploadFile file) { return fileMapper.InsertFile(file); }

    @Override
    public void UpdateFile(UploadFile file) { fileMapper.UpdateFile(file); }
}

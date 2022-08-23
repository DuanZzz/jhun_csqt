package com.example.jhun_csqt.entity.Common.PageDTO;

import lombok.Data;

import java.util.List;

@Data
public class Page {
    /**
     * 每页数据
     */
    private List records;

    /**
     * 当前页
     */
    private long currentPage;

    /**
     * 每页条数
     */
    private long pageSize;

    /**
     * 总条数
     */
    private long total;

    /**
     * 页面数
     */
    private long pages;

    public Page() {}

    public Page(List records, long currentPage, long pageSize, long total, long pages) {
        this.records = records;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.total = total;
        this.pages = pages;
    }
}

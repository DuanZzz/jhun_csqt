package com.example.jhun_csqt.entity.Query;

import lombok.Data;

@Data
public class AlgOverviewQuery {
    /**
     * 算法的id（自增主键）
     */
    public Integer id;

    /**
     * 算法标题
     */
    private String title;

    public AlgOverviewQuery() { }

    public AlgOverviewQuery(String title) {
        this.title = title;
    }

    public AlgOverviewQuery(Integer id, String title) {
        this.id = id;
        this.title = title;
    }
}

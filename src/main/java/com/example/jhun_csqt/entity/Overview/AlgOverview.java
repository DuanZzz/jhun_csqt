package com.example.jhun_csqt.entity.Overview;

import lombok.Data;

@Data
public class AlgOverview {
    /**
     * 算法的id（自增主键）
     */
    private Integer id;

    /**
     * 算法标题
     */
    private String title;

    /**
     * 作者和机构
     */
    private String authorAndInstitution;

    /**
     * 出版时间
     */
    private String publicDate;

    /**
     * 级别和名称
     */
    private String gradeAndName;

    /**
     * 算法的内容描述（文字）
     */
    private String wordDesc;

    /**
     * 算法的内容描述（图片）
     */
    private String images;

    /**
     * 算法的pdf文件
     */
    private String pdfFiles;

    public AlgOverview() {}

    public AlgOverview(String title, String authorAndInstitution, String publicDate, String gradeAndName, String wordDesc, String images, String pdfFiles) {
        this.title = title;
        this.authorAndInstitution = authorAndInstitution;
        this.publicDate = publicDate;
        this.gradeAndName = gradeAndName;
        this.wordDesc = wordDesc;
        this.images = images;
        this.pdfFiles = pdfFiles;
    }

    public AlgOverview(Integer id, String title, String authorAndInstitution, String publicDate, String gradeAndName, String wordDesc, String images, String pdfFiles) {
        this.id = id;
        this.title = title;
        this.authorAndInstitution = authorAndInstitution;
        this.publicDate = publicDate;
        this.gradeAndName = gradeAndName;
        this.wordDesc = wordDesc;
        this.images = images;
        this.pdfFiles = pdfFiles;
    }

    @Override
    public String toString() {
        return "AlgOverview{" +
                "title='" + title + '\'' +
                ", authorAndInstitution='" + authorAndInstitution + '\'' +
                ", publicDate='" + publicDate + '\'' +
                ", gradeAndName='" + gradeAndName + '\'' +
                ", wordDesc='" + wordDesc + '\'' +
                ", images='" + images + '\'' +
                ", pdfFiles='" + pdfFiles + '\'' +
                '}';
    }
}

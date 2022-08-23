package com.example.jhun_csqt.utils.Page;

public class page {
    /**
     * 获取页面数
     *
     * @param total 总条数
     * @param maxPageSize 每页最大条数
     * @return
     */
    public static long getPages(long total, long maxPageSize) {
        if(total % maxPageSize == 0) {
            return total / maxPageSize;
        } else {
            return (total / maxPageSize) + 1;
        }
    }

    /**
     * 获取每页条数
     *
     * @param currentPage 当前页
     * @param total 总条数
     * @param maxPageSize 每页最大条数
     * @return
     */
    public static long getPageSize(long currentPage, long total, long maxPageSize) {
        if(total % maxPageSize == 0) {
            return maxPageSize;
        } else {
            long lastPage = (total / maxPageSize) + 1;
            if(currentPage == lastPage) {
                return total - (maxPageSize * (total / maxPageSize));
            } else {
                return maxPageSize;
            }
        }
    }
}

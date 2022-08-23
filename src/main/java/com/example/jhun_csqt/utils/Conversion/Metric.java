package com.example.jhun_csqt.utils.Conversion;

import java.text.DecimalFormat;

public class Metric {

    public static String fromBConvert(long fileSize) {
        // 定义两个变量
        String fileSizeStr = "";
        double tmpStr = 0;
        // 数据单位为B时不转换
        if (fileSize < 1024) {
            fileSizeStr = resKeepTwoDP(fileSize) + "B";
        }
        // B转换为KB
        else if (fileSize / 1024 < 1024) {
            tmpStr = (double) fileSize / (double) 1024;
            fileSizeStr = resKeepTwoDP(tmpStr) + "KB";
        }
        // B转换为MB
        else if (fileSize / 1024 / 1024 < 1024) {
            tmpStr = (double) fileSize / (double) 1024 / (double) 1024;
            fileSizeStr = resKeepTwoDP(tmpStr) + "MB";
        }
        // B转换为GB
        else {
            tmpStr = (double) fileSize / (double) 1024 / (double) 1024 / (double) 1024;
            fileSizeStr = resKeepTwoDP(tmpStr) + "GB";
        }
        return fileSizeStr;
    }

    /**
     * 结果保留小数点后两位
     *
     * @param result
     * @return
     */
    public static String resKeepTwoDP(double result) {
        // 类型转换
        String RES = String.valueOf(result);
        // 获取字符串中小数点第一次出现的位置
        int index = RES.indexOf('.');
        if (index == -1) {
            return RES += ".00";
        } else {
            // 小数点后只有一位数时（补零）
            if (index + 2 == RES.length()) {
                return RES += "0";
            } else if (index + 3 == RES.length()) { // 小数点后有刚好有两位数时，直接返回
                return RES;
            } else {
                // 四舍
                if (RES.charAt(index + 3) - 48 < 5) {
                    return RES.substring(0, index + 3);
                } else { // 五入
                    StringBuilder builder = new StringBuilder(RES.substring(0, index + 3));
                    // 进位运算
                    for (int i = index + 2; i >= 0; i--) {
                        if (builder.charAt(i) == '.') {
                            continue;
                        }
                        if (RES.charAt(i) - 48 + 1 >= 10) {
                            builder.replace(i, i + 1, String.valueOf((RES.charAt(i) - 48 + 1) - 10));
                            if (i == 0) {
                                return "1" + builder.toString(); // 最后一位依然进位时（在最前面补上一个1）
                            }
                        } else { // 不进位时替换字符退出循环
                            builder.replace(i, i + 1, String.valueOf(RES.charAt(i) - 48 + 1));
                            break;
                        }
                    }
                    return builder.toString();
                }
            }
        }
    }

    /*
     * 将double类型的时间数据保留小数点后k位显示
     */
    public static String txdouble(double time, int k) {
        String formatter = "0.";
        for (int i = 0; i < k; i++) {
            formatter += '0';
        }
        // TODO 自动生成的方法存根
        DecimalFormat df = new DecimalFormat(formatter); // 设置保留位数
        return df.format(time);
    }

    /* 将除法按照保留小数位显示 */
    public static String txfloat(long a,long b) {
        // TODO 自动生成的方法存根
        DecimalFormat df=new DecimalFormat("0.0000"); //设置保留位数
        return df.format((float)a/b);
    }
}

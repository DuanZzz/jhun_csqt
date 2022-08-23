package com.example.jhun_csqt.utils.EncryptionAlg.Code;

public class RandomCode {
    /**
     * 随机编码生成器
     *
     * @param num
     * @return
     */
    public static String randomRangeCode(int num){
        String result = "";
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(int i = 0; i < num; i++) {
            long j = Math.round(Math.random() * (str.length() - 1));
            int index = new Long(j).intValue();
            result += str.substring(index, index+1);
        }
        return  result;
    }
}

package com.example.jhun_csqt.utils.algContrast;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class Judgement {
    // 其中data1和data2均为json字符串（只涉及基于(α,β)-AWCS和SC(significant(α,β)-community)模型的算法输入数据的比较）
    public static int inputDataIsEqual(String algName, String data1, String data2) {
        // 首先解析两个json字符串为JSONObject对象
        JSONObject data1_Object = JSONObject.parseObject(data1);
        JSONObject data2_Object = JSONObject.parseObject(data2);

        if(algName.equals("(α,β)-AWCS")) {
            if(data1_Object.getString("nodeId").equals(data2_Object.getString("nodeId"))
                    && data1_Object.getString("upperDegree").equals(data2_Object.getString("upperDegree"))
                    && data1_Object.getString("lowerDegree").equals(data2_Object.getString("lowerDegree"))
                    && data1_Object.getString("constraintWay").equals(data2_Object.getString("constraintWay"))) {
                JSONArray data1_keywords = (JSONArray)data1_Object.get("keywords");
                JSONArray data2_keywords = (JSONArray)data2_Object.get("keywords");
                for (int i = 0; i < data1_keywords.size(); i++) {
                    String data1_keyword = data1_keywords.getString(i);
                    int counter = 0;
                    for (int j = 0; j < data2_keywords.size(); j++) {
                        if(!data1_keyword.equals(data2_keywords.getString(j))) {
                            counter++;
                        }
                    }
                    if(counter == data2_keywords.size()) {
                        return 0;
                    }
                }
                return 1;
            } else {
                return 0;
            }
        } else if(algName.equals("SC(significant(α,β)-community)")) {
            if(data1_Object.getString("nodeId").equals(data2_Object.getString("nodeId"))
                    && data1_Object.getString("upperDegree").equals(data2_Object.getString("upperDegree"))
                    && data1_Object.getString("lowerDegree").equals(data2_Object.getString("lowerDegree"))) {
                JSONArray data1_keywords = (JSONArray)data1_Object.get("keywords");
                JSONArray data2_keywords = (JSONArray)data2_Object.get("keywords");
                if(data1_keywords.size() == 0) {
                    if(data2_keywords.size() > 0) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else {
                    if(data2_keywords.size() > 0) {
                        for (int i = 0; i < data1_keywords.size(); i++) {
                            String data1_keyword = data1_keywords.getString(i);
                            int counter = 0;
                            for (int j = 0; j < data2_keywords.size(); j++) {
                                if(!data1_keyword.equals(data2_keywords.getString(j))) {
                                    counter++;
                                }
                            }
                            if(counter == data2_keywords.size()) {
                                return 0;
                            }
                        }
                        return 1;
                    } else {
                        return 0;
                    }
                }
            } else {
                return 0;
            }
        }
        return -1;
    }
}

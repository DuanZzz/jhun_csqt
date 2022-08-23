package com.example.jhun_csqt.utils.Sift;

import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.αβAWCS.WithAttrEdge;

import java.util.*;

public class CalDifferentElementNum {
    /* 筛选出用户每条评价的评分中不同分值的个数（用于分析输出社区中的评分分布情况） */
    public static Map<Float, Integer> outCommunity_score(ArrayList<WithAttrEdge> out_withAttrEdges) {
        Map<Float, Integer> scoreMap = new HashMap<>();
        for (WithAttrEdge edge:
                out_withAttrEdges) {
            if(scoreMap.get(edge.getScore()) == null) {
                scoreMap.put(edge.getScore(), 1);
            } else {
                scoreMap.put(edge.getScore(), (scoreMap.get(edge.getScore()) + 1));
            }
        }
        return scoreMap;
    }

    // 生成用户评分分数分布的json字符串
    public static String getScoreDistributeJsonStr(ArrayList<WithAttrEdge> out_withAttrEdges) {
        // 分数分布的json字符串
        JSONObject score_distribute = new JSONObject();
        // 初始化score_distribute
        score_distribute.put("one", 0);
        score_distribute.put("two", 0);
        score_distribute.put("three", 0);
        score_distribute.put("four", 0);
        score_distribute.put("five", 0);
        // 获取用户具体评分的个数散列表
        Map<Float, Integer> scoreMap = CalDifferentElementNum.outCommunity_score(out_withAttrEdges);

        Map<String, Integer> scoreDistribute = new HashMap<>();
        Set<Map.Entry<Float, Integer>> set = scoreMap.entrySet();
        Iterator<Map.Entry<Float, Integer>> iterator = set.iterator();
        while (iterator.hasNext()) {
            Map.Entry<Float, Integer> vertexEntry = iterator.next();
            float key = vertexEntry.getKey();
            if(key >= 0.0 && key <= 1.0) {
                scoreDistribute.put("one", (scoreDistribute.get("one") == null ? 0 : scoreDistribute.get("one")) + vertexEntry.getValue());
            } else if(key > 1.0 && key <= 2.0) {
                scoreDistribute.put("two", (scoreDistribute.get("two") == null ? 0 : scoreDistribute.get("two")) + vertexEntry.getValue());
            } else if(key > 2.0 && key <= 3.0) {
                scoreDistribute.put("three", (scoreDistribute.get("three") == null ? 0 : scoreDistribute.get("three")) + vertexEntry.getValue());
            } else if(key > 3.0 && key <= 4.0) {
                scoreDistribute.put("four", (scoreDistribute.get("four") == null ? 0 : scoreDistribute.get("four")) + vertexEntry.getValue());
            } else if(key > 4.0 && key <= 5.0) {
                scoreDistribute.put("five", (scoreDistribute.get("five") == null ? 0 : scoreDistribute.get("five")) + vertexEntry.getValue());
            }
        }
        // 遍历scoreDistribute并生成分数分布的json字符串
        Set<Map.Entry<String, Integer>> set1 = scoreDistribute.entrySet();
        Iterator<Map.Entry<String, Integer>> iterator1 = set1.iterator();
        while (iterator1.hasNext()) {
            Map.Entry<String, Integer> vertexEntry1 = iterator1.next();
            String key = vertexEntry1.getKey();
            Integer value = vertexEntry1.getValue();
            score_distribute.put(key, value);
        }

        return score_distribute.toJSONString();
    }
}

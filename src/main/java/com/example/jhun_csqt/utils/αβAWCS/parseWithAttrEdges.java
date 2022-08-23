package com.example.jhun_csqt.utils.αβAWCS;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.αβAWCS.WithAttrEdge;

import java.util.ArrayList;
import java.util.Iterator;

public class parseWithAttrEdges {
    /**
     * 将带属性的边集解析为JSONArray
     *
     * @param withAttrEdges
     * @return
     */
    public static JSONArray parseEdges(ArrayList<WithAttrEdge> withAttrEdges) {
        JSONArray out_jsonArr = new JSONArray();
        Iterator<WithAttrEdge> withAttrEdgeIterator = withAttrEdges.iterator();
        while ((withAttrEdgeIterator.hasNext())) {
            JSONObject out_jsonStr = new JSONObject();
            WithAttrEdge withAttrEdge = withAttrEdgeIterator.next();
            out_jsonStr.put("leftName", withAttrEdge.getLeftName());
            out_jsonStr.put("leftKeywords", withAttrEdge.getLeftKeywords());
            out_jsonStr.put("leftMark", withAttrEdge.getLeftMark());
            out_jsonStr.put("rightName", withAttrEdge.getRightName());
            out_jsonStr.put("rightKeywords", withAttrEdge.getRightKeywords());
            out_jsonStr.put("rightMark", withAttrEdge.getRightMark());
            out_jsonStr.put("score", withAttrEdge.getScore());
            out_jsonArr.add(out_jsonStr);
        }
        return out_jsonArr;
    }

    /**
     * 将JSONArray解析为带属性的边集
     *
     * @param jsonArray
     * @return
     */
    public static ArrayList<WithAttrEdge> parseJsonArr(JSONArray jsonArray) {
        // 定义一个带属性边的集合
        ArrayList<WithAttrEdge> withAttrEdges = new ArrayList<>();
        Iterator<Object> objectIterator = jsonArray.iterator();
        while ((objectIterator.hasNext())) {
            JSONObject jsonObject = (JSONObject) objectIterator.next();
            String leftName = jsonObject.getString("leftName");
            JSONArray leftJsonArr = (JSONArray) jsonObject.get("leftKeywords");
            ArrayList<String> leftKeywords = new ArrayList<>();
            if(leftJsonArr != null) {
                for (int i = 0; i < leftJsonArr.size(); i++) {
                    String tmp = leftJsonArr.getString(i);
                    leftKeywords.add(tmp);
                }
            }
            int leftMark = (Integer) jsonObject.get("leftMark");
            String rightName = jsonObject.getString("rightName");
            JSONArray rightJsonArr = (JSONArray) jsonObject.get("rightKeywords");
            ArrayList<String> rightKeywords = new ArrayList<>();
            if(rightJsonArr != null) {
                for (int i = 0; i < rightJsonArr.size(); i++) {
                    String tmp = rightJsonArr.getString(i);
                    rightKeywords.add(tmp);
                }
            }
            int rightMark = (Integer) jsonObject.get("rightMark");
            float score = Float.parseFloat(jsonObject.getString("score"));
            WithAttrEdge withAttrEdge = new WithAttrEdge(leftName, leftKeywords, leftMark, rightName, rightKeywords, rightMark, score);
            withAttrEdges.add(withAttrEdge);
        }
        return withAttrEdges;
    }
}

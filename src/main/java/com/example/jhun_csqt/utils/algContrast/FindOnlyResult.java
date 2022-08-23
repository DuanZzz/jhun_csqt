package com.example.jhun_csqt.utils.algContrast;

import com.example.jhun_csqt.entity.algContrast.AlgContrastResult;

import java.util.List;

public class FindOnlyResult {
    public AlgContrastResult getResultEntity(String algName, String inputData, List<AlgContrastResult> algContrastResults) {
        // 在数据库中搜索到的结果
        AlgContrastResult finalResult = null;
        // 判断
        if(algContrastResults.size() > 0) {
            for (int i = 0; i < algContrastResults.size(); i++) {
                AlgContrastResult algContrastResult = algContrastResults.get(i);
                String tmp_inputData = algContrastResult.getInputData();
                // 比较算法输入数据是否相等（不包括算法名和数据集）
                int resultSign = Judgement.inputDataIsEqual(algName, tmp_inputData, inputData);
                if(resultSign == 1) {
                    finalResult = algContrastResult;
                    break;
                }
            }
        }
        return finalResult;
    }
}

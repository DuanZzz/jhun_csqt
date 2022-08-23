package com.example.jhun_csqt.utils.EncryptionAlg.ECC;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import java.security.*;

public class ECC_Alg {

    private static final String EC_ALGORITHM = "EC";

    private static final String EC_PROVIDER = "BC";
    // 静态初始化块初始Provider
    static {
        try {
            Security.addProvider(new BouncyCastleProvider());
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    private static final String ECIES_ALGORITHM = "ECIES";

    /**
     * 生成密钥对
     *
     * @param keySize 密钥长度
     * @return
     */
    public static KeyPair generateECCKeyPair(int keySize) {
        try {
            // 获取指定算法的密钥对生成器
            KeyPairGenerator generator = KeyPairGenerator.getInstance(EC_ALGORITHM, EC_PROVIDER);
            // 初始化密钥对生成器（指定密钥长度, 使用默认的安全随机数源）
            generator.initialize(keySize);
            // 随机生成一对密钥（包含公钥和私钥）
            return generator.generateKeyPair();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * ECC 加密
     *
     * @param publicKey 公钥
     * @param plain     原文
     * @return　密文
     */
    public static byte[] eccEncrypt(PublicKey publicKey, byte[] plain) {
        try {
            Cipher cipher = Cipher.getInstance(ECIES_ALGORITHM, EC_PROVIDER);
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            return cipher.doFinal(plain);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * ECC 解密
     *
     * @param privateKey 　私钥
     * @param encrypted  　密文
     * @return　原文
     */
    public static byte[] eccDecrypt(PrivateKey privateKey, byte[] encrypted) {
        try {
            Cipher cipher = Cipher.getInstance(ECIES_ALGORITHM, EC_PROVIDER);
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            return cipher.doFinal(encrypted);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据明文和密钥对获取密文
     *
     * @param clearText 明文
     * @return
     */
    public static byte[] getCiphertext(KeyPair keyPair, String clearText) {
        if(keyPair != null) {
            if(clearText != null && !clearText.isEmpty()) {
                return eccEncrypt(keyPair.getPublic(), clearText.getBytes());
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * 根据密文和密钥对获取明文
     *
     * @param cipherBytes 密文
     * @return
     */
    public static String getCleartext(KeyPair keyPair, byte[] cipherBytes) {
        if(keyPair != null) {
            if(cipherBytes != null && cipherBytes.length > 0) {
                return new String(eccDecrypt(keyPair.getPrivate(), cipherBytes));
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

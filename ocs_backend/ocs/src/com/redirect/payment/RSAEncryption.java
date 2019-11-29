package com.redirect.payment;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.logging.Logger;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;

public class RSAEncryption {

    private static final String ALGORITHM = "RSA";
    
    private static String privateKey = "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAn4Yl1JIR5o0UEurJ8zcMg6BCBYLAnQg195llXshOwt64Dth3TauuRgYiLHUha+h5tZWbOGdxR6ljEfArUBEJ1QIDAQABAkEAhp7kifEC3jcsO5Kb/n30N5gkXxYqidqGAH8ZBtWvcc7Ah+DJisKssOt53YBh1DYHPB0LhSNtWM6g6bztYfkKgQIhANY7OfoDMom0mKW9E2i759RJJV4WJDWiAUyyBc5JmKMRAiEAvqBaj1hlR1Krc+UjFnRwnCf1cqkMdn8ZTxgdSL87MoUCIFxCpXVGaz1iyVqXUwSH6A9EcRNT9cQjQOwGvvlYOKQBAiAOwjeAtaVRulLP7EOlL2qwjF9yeygd3IVHHGTYBwY8SQIgA3c5936lyofTCk41hZASXwL90iiAQJ6stYeTseFaE/Y=";
    private static String publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==";
    
    private static Logger logger = Logger.getLogger("RSAEncryption");

    public static String encrypt(String text) {
    	
    	byte[] inputData = text.getBytes();
    	
    	try{

	        PublicKey key = KeyFactory.getInstance(ALGORITHM)
	                .generatePublic(new X509EncodedKeySpec(decodeBase64(publicKey)));
	
	        Cipher cipher = Cipher.getInstance(ALGORITHM);
	        cipher.init(Cipher.ENCRYPT_MODE, key);
	
	        byte[] encryptedBytes = cipher.doFinal(inputData);
	        
	        String encrypted = encodeBase64(encryptedBytes);
	        
	        return encrypted;
	
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	
    	return text;
    }

    public static String decrypt(String encrypted){
    	
    	try{
    	
	    	byte[] inputData = decodeBase64(encrypted);
	    	
	        PrivateKey key = KeyFactory.getInstance(ALGORITHM)
	                .generatePrivate(new PKCS8EncodedKeySpec(decodeBase64(privateKey)));
	
	        Cipher cipher = Cipher.getInstance(ALGORITHM);
	        cipher.init(Cipher.DECRYPT_MODE, key);
	
	        byte[] decryptedBytes = cipher.doFinal(inputData);
	        
	        return new String(decryptedBytes);
        
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	
    	return encrypted;
    }

//    public static KeyPair generateKeyPair()
//            throws NoSuchAlgorithmException, NoSuchProviderException {
//    	
//    	logger.info("Generating RSA public and private keys");
//
//        KeyPairGenerator keyGen = KeyPairGenerator.getInstance(ALGORITHM);
//
//        SecureRandom random = SecureRandom.getInstance("SHA1PRNG", "SUN");
//        // 512 is keysize
//        keyGen.initialize(512, random);
//
//        KeyPair generateKeyPair = keyGen.generateKeyPair();
//        
//        return generateKeyPair;
//    }
    
//    public static String getBase64EncodedPublicKey(KeyPair keypair) throws IOException{
//    	return encodeBase64(keypair.getPublic().getEncoded());
//    }
//    
//    public static String getBase64EncodedPrivateKey(KeyPair keypair) throws IOException{
//    	return encodeBase64(keypair.getPrivate().getEncoded());
//    }

    public static String encodeBase64(byte[] inputData) throws IOException {
        String encodedData = new String(Base64.encodeBase64(inputData, false));
        return  encodedData;
    }

    public static byte[] decodeBase64(String base64Data) throws IOException {
//        BASE64Decoder base64Decoder = new BASE64Decoder();
//        byte[] decodedData = base64Decoder.decodeBuffer(base64Data);
        return  Base64.decodeBase64(base64Data);
    }
    
    public static void main(String args[]){
    	String decrypted = decrypt("bScJWvZaar0D+lyqtQCVajgfONaomeG4EQGfh/oB5aVCU64MDztcHbPrJBXlkWzEMGT5lNOgfEgA07pumbTo2w==");
    	System.out.println(decrypted);
    }
}

package com.gertec_800;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.MifareClassic;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import br.com.gertec.gedi.exceptions.GediException;

import static android.hardware.Camera.Parameters.FLASH_MODE_ON;
import static com.gertec_800.MainActivity.gertecPrinter;


public class ToastModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    private ConfigPrint configPrint = new ConfigPrint();


    private String tipoCode;
    // Adaptador NFC
    private NfcAdapter nfcAdapter;

    // Class MifareClassic
    private MifareClassic mifareClassic;

    // Tag do Cartão
    private Tag tag;




    ToastModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "ToastExample";
    }
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }
    void ShowFalha(String sStatus){
        showMessagem("Falha Impressor",sStatus);
    }
    protected void showMessagem(String titulo, String mensagem){
        AlertDialog alertDialog = new AlertDialog.Builder(reactContext.getApplicationContext()).create();
        alertDialog.setTitle(titulo);
        alertDialog.setMessage(mensagem);
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
    }
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        //super(onActivityResult(activity,requestCode,resultCode,data));
        IntentResult intentResult = IntentIntegrator.parseActivityResult(requestCode,resultCode,data);
        if(intentResult != null){
            if(intentResult.getContents() == null){
//                Toast.makeText(reactContext.getApplicationContext(),"Resultado não encontrado", Toast.LENGTH_SHORT).show();
                WritableMap params = Arguments.createMap();
                params.putString("bar", this.tipoCode+": "+"Não foi possível ler o código");
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventName", params);

            }else{
                try{
//                    Toast.makeText(reactContext.getApplicationContext(),intentResult.getContents(), Toast.LENGTH_SHORT).show();
                    WritableMap params = Arguments.createMap();
                    params.putString("bar", this.tipoCode+": "+intentResult.getContents());
                    reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("eventName", params);



                }catch (Exception e){
                    e.printStackTrace();

                }
            }
        }

    }

    @Override
    public void onNewIntent(Intent intent) {


    }


    @ReactMethod
    public void show(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();
    }


    @ReactMethod
    public void imprimeTexto(String texto, String fontFamily, int fontSize, boolean negrito, boolean italico, boolean sublinhado, String alinhamento) {
        this.configPrint.setTamanho(fontSize);
        this.configPrint.setNegrito(negrito);
        this.configPrint.setItalico(italico);
        this.configPrint.setSublinhado(sublinhado);
        this.configPrint.setAlinhamento(alinhamento);
        try{
             gertecPrinter.getStatusImpressora();
            if(gertecPrinter.isImpressoraOK()){
                gertecPrinter.setConfigImpressao(configPrint);
                gertecPrinter.imprimeTexto(texto);
                gertecPrinter.ImpressoraOutput();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void imprimeImagem() throws GediException{

        try{


            gertecPrinter.getStatusImpressora();
            if(gertecPrinter.isImpressoraOK()){
                gertecPrinter.imprimeImagem("invoice");

        try{
            String sStatus = gertecPrinter.getStatusImpressora();
            if(gertecPrinter.isImpressoraOK()) {
                configPrint = new ConfigPrint();
                gertecPrinter.setConfigImpressao(configPrint);
                gertecPrinter.imprimeImagem("invoice");
                // Usado apenas no exemplo, esse pratica não deve
                // ser repetida na impressão em produção
                gertecPrinter.avancaLinha(150);
                gertecPrinter.ImpressoraOutput();
            }else{
                ShowFalha(sStatus);
            }
           gertecPrinter.ImpressoraOutput();
        }catch (GediException e){
            e.printStackTrace();
            Toast.makeText(reactContext.getApplicationContext(), e.getMessage(), Toast.LENGTH_LONG).show();
        }

    }
    @ReactMethod
    public void imprimeBarCode(String texto, int height, int width, String barCodeType ) throws GediException {
        configPrint.setAlinhamento("CENTER");
        gertecPrinter.setConfigImpressao(configPrint);
        try{
            gertecPrinter.getStatusImpressora();
            if(gertecPrinter.isImpressoraOK()){
                gertecPrinter.imprimeBarCode(texto,height,width,barCodeType);

            }
            gertecPrinter.ImpressoraOutput();
        }catch (GediException e){
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void statusImpressora() throws GediException {
//        gertecPrinter = new GertecPrinter(getCurrentActivity());
//        gertecPrinter.setConfigImpressao(configPrint);

        try{

            String status = gertecPrinter.getStatusImpressora();
            WritableMap params = Arguments.createMap();
            params.putString("status", status);
             reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventStatus", params);
        }catch (GediException e ){
            e.printStackTrace();

        }


    }
    @ReactMethod
    public void imprimeTudo()  {

        configPrint.setItalico(false);
        configPrint.setNegrito(true);
        configPrint.setTamanho(20);
        configPrint.setFonte("MONOSPACE");
        gertecPrinter.setConfigImpressao(configPrint);
        try {
            gertecPrinter.getStatusImpressora();
            // Imprimindo Imagem
            configPrint.setiWidth(300);
            configPrint.setiHeight(130);
            configPrint.setAlinhamento("CENTER");
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("==[Iniciando Impressao Imagem]==");
            gertecPrinter.imprimeImagem("gertec_2");
            gertecPrinter.avancaLinha(10);
            gertecPrinter.imprimeTexto("====[Fim Impressão Imagem]====");
            gertecPrinter.avancaLinha(10);
            // Fim Imagem

            // Impressão Centralizada
            configPrint.setAlinhamento("CENTER");
            configPrint.setTamanho(30);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("CENTRALIZADO");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Centralizada

            // Impressão Esquerda
            configPrint.setAlinhamento("LEFT");
            configPrint.setTamanho(40);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("ESQUERDA");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Esquerda

            // Impressão Direita
            configPrint.setAlinhamento("RIGHT");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("DIREITA");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Direita

            // Impressão Negrito
            configPrint.setNegrito(true);
            configPrint.setAlinhamento("LEFT");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("=======[Escrita Netrigo]=======");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Negrito

            // Impressão Italico
            configPrint.setNegrito(false);
            configPrint.setItalico(true);
            configPrint.setAlinhamento("LEFT");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("=======[Escrita Italico]=======");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Italico

            // Impressão Italico
            configPrint.setNegrito(false);
            configPrint.setItalico(false);
            configPrint.setSublinhado(true);
            configPrint.setAlinhamento("LEFT");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("======[Escrita Sublinhado]=====");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Italico

            // Impressão BarCode 128
            configPrint.setNegrito(false);
            configPrint.setItalico(false);
            configPrint.setSublinhado(false);
            configPrint.setAlinhamento("CENTER");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("====[Codigo Barras CODE 128]====");
            gertecPrinter.imprimeBarCode("12345678901234567890", 120,120,"CODE_128");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão BarCode 128

            // Impressão Normal
            configPrint.setNegrito(false);
            configPrint.setItalico(false);
            configPrint.setSublinhado(true);
            configPrint.setAlinhamento("LEFT");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("=======[Escrita Normal]=======");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Normal

            // Impressão Normal
            configPrint.setNegrito(false);
            configPrint.setItalico(false);
            configPrint.setSublinhado(true);
            configPrint.setAlinhamento("LEFT");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("=========[BlankLine 50]=========");
            gertecPrinter.avancaLinha(50);
            gertecPrinter.imprimeTexto("=======[Fim BlankLine 50]=======");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão Normal

            // Impressão BarCode 13
            configPrint.setNegrito(false);
            configPrint.setItalico(false);
            configPrint.setSublinhado(false);
            configPrint.setAlinhamento("CENTER");
            configPrint.setTamanho(20);
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("=====[Codigo Barras EAN13]=====");
            gertecPrinter.imprimeBarCode("7891234567895", 120,120,"EAN_13");
            gertecPrinter.avancaLinha(10);
            // Fim Impressão BarCode 128

            // Impressão BarCode 13
            gertecPrinter.setConfigImpressao(configPrint);
            gertecPrinter.imprimeTexto("===[Codigo QrCode Gertec LIB]==");
            gertecPrinter.avancaLinha(10);
            gertecPrinter.imprimeBarCode("Gertec Developer Partner LIB", 240,240,"QR_CODE");

            configPrint.setNegrito(false);
            configPrint.setItalico(false);
            configPrint.setSublinhado(false);
            configPrint.setAlinhamento("CENTER");
            configPrint.setTamanho(20);
            gertecPrinter.imprimeTexto("===[Codigo QrCode Gertec IMG]==");
            gertecPrinter.imprimeBarCode("Gertec Developer Partner", 240,240,"QR_CODE");

            gertecPrinter.avancaLinha(100);

        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            try {
                gertecPrinter.ImpressoraOutput();
            } catch (GediException e) {
                e.printStackTrace();
            }
        }
    }




    @ReactMethod
    public void startCameraV1(String titulo){

        switch (titulo){
            case "EAN 8":

                this.tipoCode = "EAN_8";
                break;

            case "EAN 13":

                this.tipoCode = "EAN_13";
                break;

            case "EAN 14":

                this.tipoCode = "EAN_14";
                break;

            case "QRCODE":

                this.tipoCode = "QR_CODE";
                break;
        }

        Activity activity = getCurrentActivity();
        IntentIntegrator qrScan = new IntentIntegrator(activity);


        qrScan.setPrompt("Digitalizar o código " + titulo );
        qrScan.setBeepEnabled(true);
        qrScan.setBarcodeImageEnabled(true);
        qrScan.setTimeout(30000); // 30 * 1000 => 3 minuto
        qrScan.addExtra("FLASH_MODE_ON", FLASH_MODE_ON);
        qrScan.initiateScan(Collections.singleton(this.tipoCode));


    }
    @ReactMethod
    public void startCameraV2(){
        Activity activity = getCurrentActivity();
        Intent intent = new Intent(getCurrentActivity(), CodigoBarras2.class);
        activity.startActivity(intent);
    }

    @ReactMethod
    public void nfcGravar(String mensagem){
        Activity activity = getCurrentActivity();
        Intent  intent = new Intent(getCurrentActivity(),NFCWriteFragment.class);
        intent.putExtra("mensagemGravar", mensagem);
        activity.startActivity(intent);
    }
    @ReactMethod
    public void nfcLeitura(){
        Activity activity = getCurrentActivity();
        Intent  intent = new Intent(getCurrentActivity(),NFCReadFragment.class);
        activity.startActivity(intent);
    }
    @ReactMethod
    public void nfcFormatar(){
        Activity activity = getCurrentActivity();
        Intent  intent = new Intent(getCurrentActivity(),NFCFormatFragment.class);
        activity.startActivity(intent);
    }
    @ReactMethod
    public void nfcLeituraGravação(){
        Activity activity = getCurrentActivity();
        Intent  intent = new Intent(getCurrentActivity(),NFCWriteReadFragment.class);
        activity.startActivity(intent);
    }

}

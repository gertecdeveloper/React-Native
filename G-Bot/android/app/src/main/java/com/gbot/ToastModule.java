// ToastModule.java

package com.gbot;

import android.widget.Toast;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.ReadableArray;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import com.facebook.react.bridge.ActivityEventListener;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;


import java.util.Map;
import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import static com.gbot.MainActivity.satLib;
import static com.gbot.MainActivity.kioskMode;
import static com.gbot.MainActivity.mLeituraCodigoActivity;

public class ToastModule extends ReactContextBaseJavaModule implements ActivityEventListener{
    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public static boolean sensorStart = false;

    Bundle bundle = new Bundle();

    ToastModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;        

        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "NativeModulesGBOT";
    }

    public void onNewIntent(Intent intent) {}

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        IntentResult intentResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);

        if(requestCode == 4321) {
            if (resultCode == RESULT_OK || resultCode == RESULT_CANCELED && data != null) {
                try {
                    WritableMap params2 = Arguments.createMap();

                    params2.putString("msitef", respSitefToJson(data));
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventSitef", params2);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else {
                Toast.makeText(reactContext.getApplicationContext(), "Transação cancelada!", Toast.LENGTH_LONG).show();
            }
        }
    }

    public String respSitefToJson(Intent data) throws JSONException {
        JSONObject json = new JSONObject();

        json.put("CODRESP",data.getStringExtra("CODRESP"));
        json.put("COMP_DADOS_CONF",data.getStringExtra("COMP_DADOS_CONF"));
        json.put("CODTRANS",data.getStringExtra("CODTRANS"));
        json.put("VLTROCO",data.getStringExtra("VLTROCO"));
        json.put("REDE_AUT",data.getStringExtra("REDE_AUT"));
        json.put("BANDEIRA",data.getStringExtra("BANDEIRA"));
        json.put("NSU_SITEF",data.getStringExtra("NSU_SITEF"));
        json.put("NSU_HOST",data.getStringExtra("NSU_HOST"));
        json.put("COD_AUTORIZACAO",data.getStringExtra("COD_AUTORIZACAO"));
        json.put("NUM_PARC",data.getStringExtra("NUM_PARC"));
        json.put("TIPO_PARC",data.getStringExtra("TIPO_PARC"));
        json.put("VIA_ESTABELECIMENTO",data.getStringExtra("VIA_ESTABELECIMENTO"));
        json.put("VIA_CLIENTE",data.getStringExtra("VIA_CLIENTE"));

        return json.toString();
    }

    @ReactMethod
    public void StartLeitura(boolean activeReadBarCode){
        if(activeReadBarCode){
            mLeituraCodigoActivity.StartService();
        }else{
            mLeituraCodigoActivity.StopService();
        }
    }

    public static void ListReturnBarCode(String result){
        WritableMap params = Arguments.createMap();

        params.putString("resultado", result);
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("resultadoBarCode", params);
    }

    @ReactMethod
    public void LedOnOff(boolean activeLedBarCode){
        if(activeLedBarCode){
            mLeituraCodigoActivity.LedOn();
        }else{
            mLeituraCodigoActivity.LedOff();
        }
    }

    @ReactMethod
    public void StartSensor(boolean activeSensor){
        if(activeSensor){
            sensorStart = activeSensor;
            System.out.println("SensorON" + sensorStart);
        }else{
            sensorStart = false;
            System.out.println("SensorOFF" + sensorStart);
        }
    }

    public static void onKeyDownEvent(String result) {
        WritableMap params = Arguments.createMap();

        params.putString("resultado", result);
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("resultadoSensor", params);
    };

    @ReactMethod
    public void AtivarKioskMode(String ativo){
        try {
            if(ativo.equals("ativado")){
                kioskMode.startKiosMode();
            }else if(ativo.equals("desativado")){
                kioskMode.stopKioskMode();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void realizarAcaoMsiTef(ReadableMap map, String tipo){
        Intent intentSitef = new Intent("br.com.softwareexpress.sitef.msitef.ACTIVITY_CLISITEF");
        Activity activity = getCurrentActivity();

        switch(tipo){
            case "venda":
                bundle.putString("empresaSitef",map.getString("empresaSitef"));
                bundle.putString("enderecoSitef",map.getString("enderecoSitef"));
                bundle.putString("operador", map.getString("operador"));
                bundle.putString("data", map.getString("data"));
                bundle.putString("hora", map.getString("hora"));
                bundle.putString("numeroCupom", map.getString("numeroCupom"));
                bundle.putString("valor", map.getString("valor"));
                bundle.putString("CNPJ_CPF", map.getString("CNPJ_CPF"));
                bundle.putString("comExterna", map.getString("comExterna"));
                bundle.putString("modalidade", map.getString("modalidade"));

                if( map.getString("transacoesHabilitadas")!="0"){
                    bundle.putString("transacoesHabilitadas", map.getString("transacoesHabilitadas"));
                }
                if(map.getString("numParcelas")!="0"){
                    bundle.putString("numParcelas", map.getString("numParcelas"));

                }
                if( map.getString("restricoes")!="0"){
                    bundle.putString("restricoes", map.getString("restricoes"));
                }

                bundle.putString("isDoubleValidation", map.getString("isDoubleValidation"));
                bundle.putString("caminhoCertificadoCA", map.getString("caminhoCertificadoCA"));

                intentSitef.putExtras(bundle);

                activity.startActivityForResult(intentSitef, 4321);
                break;

            case "cancelamento":
            case "reimpressao":
                bundle.putString("empresaSitef",map.getString("empresaSitef"));
                bundle.putString("enderecoSitef",map.getString("enderecoSitef"));
                bundle.putString("operador", map.getString("operador"));
                bundle.putString("data", map.getString("data"));
                bundle.putString("hora", map.getString("hora"));
                bundle.putString("numeroCupom", map.getString("numeroCupom"));
                bundle.putString("valor", map.getString("valor"));
                bundle.putString("CNPJ_CPF", map.getString("CNPJ_CPF"));
                bundle.putString("comExterna", map.getString("comExterna"));
                bundle.putString("modalidade", map.getString("modalidade"));
                bundle.putString("isDoubleValidation", map.getString("isDoubleValidation"));
                bundle.putString("caminhoCertificadoCA", map.getString("caminhoCertificadoCA"));

                intentSitef.putExtras(bundle);
                activity.startActivityForResult(intentSitef, 4321);
                break;

            case "funcoes":
                bundle.putString("empresaSitef",map.getString("empresaSitef"));
                bundle.putString("enderecoSitef",map.getString("enderecoSitef"));
                bundle.putString("operador", map.getString("operador"));
                bundle.putString("data", map.getString("data"));
                bundle.putString("hora", map.getString("hora"));
                bundle.putString("numeroCupom", map.getString("numeroCupom"));
                bundle.putString("valor", map.getString("valor"));
                bundle.putString("CNPJ_CPF", map.getString("CNPJ_CPF"));
                bundle.putString("comExterna", map.getString("comExterna"));
                bundle.putString("modalidade", map.getString("modalidade"));
                bundle.putString("isDoubleValidation", map.getString("isDoubleValidation"));
                bundle.putString("caminhoCertificadoCA", map.getString("caminhoCertificadoCA"));

                bundle.putString("restricoes", map.getString("restricoes"));
                intentSitef.putExtras(bundle);
                activity.startActivityForResult(intentSitef, 4321);

                break;
        }
    }

    @ReactMethod
    public void invocarMetodo(ReadableMap args){
        WritableMap params = Arguments.createMap();

        switch (args.getString("funcao")){
            case "AtivarSAT":        
                params.putString("ativar", satLib.ativarSat(
                    args.getString("codigoAtivar"),
                    args.getString("cnpj"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventAtivar", params);
                break;

            case "AssociarSAT":
                params.putString("associar", satLib.associarSat(
                    args.getString("cnpj"),
                    args.getString("cnpjSH"),
                    args.getString("codigoAtivar"),
                    args.getString("assinatura"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventAssociar", params);
                break;

            case  "ConsultarSat":
                params.putString("teste", satLib.consultarSat(
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventTeste", params);
                break;

            case  "ConsultarStatusOperacional":
                params.putString("teste", satLib.consultarStatusOperacional(
                    Integer.parseInt(args.getString("random")),
                    args.getString("codigoAtivar")
                ));

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventTeste", params);
                break;

            case  "EnviarTesteFim":
                params.putString("teste", satLib.enviarTesteFim(
                    args.getString("codigoAtivar"),
                    args.getString("xmlVenda"),
                    Integer.parseInt(args.getString("random"))
                ));
                
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventTeste", params);
                break;

            case  "CancelarUltimaVenda":
                params.putString("teste", satLib.cancelarUltimaVenda(
                    args.getString("codigoAtivar"),
                    args.getString("xmlCancelamento"),
                    args.getString("cancela"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventTeste", params);
                break;

            case  "EnviarTesteVendas":
                params.putString("teste", satLib.enviarTesteVendas(
                    args.getString("codigoAtivar"),
                    args.getString("xmlVenda"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventTeste", params);
                break;

            case  "ConsultarNumeroSessao":
                params.putString("teste", satLib.consultarNumeroSessao(
                    args.getString("codigoAtivar"),
                    Integer.parseInt(args.getString("sessao")),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventTeste", params);
                break;
            
            case "TrocarCodAtivacao":
                params.putString("alterar", satLib.trocarCodAtivacao(
                    args.getString("codigoAtivar"),
                    Integer.parseInt(args.getString("op")),
                    args.getString("codigoAtivarNovo"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventAlterar", params);
                break;
            
            case  "BloquearSat":
                params.putString("ferramenta", satLib.bloquearSat(
                    args.getString("codigoAtivar"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventFerramenta", params);
                break;

            case  "DesbloquearSat":
                params.putString("ferramenta", satLib.desbloquearSat(
                    args.getString("codigoAtivar"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventFerramenta", params);
                break;

            case  "ExtrairLog":
                params.putString("ferramenta", satLib.extrairLog(
                    args.getString("codigoAtivar"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventFerramenta", params);
                break;

            case  "AtualizarSoftware":
                params.putString("ferramenta", satLib.atualizarSoftware(
                    args.getString("codigoAtivar"),
                    Integer.parseInt(args.getString("random"))
                ));

                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventFerramenta", params);
                break;

            case  "Versao":
                params.putString("ferramenta", satLib.versao());
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("eventFerramenta", params);
                break;
        }
    }

    @ReactMethod
    public  void configRede(int random, String codigoAtivacao, ReadableArray dadosXml)  {
        try {
            WritableMap params = Arguments.createMap();
            params.putString("rede", satLib.enviarConfRede(random, dadosXml, codigoAtivacao));
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventRede", params);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}